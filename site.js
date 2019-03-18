if (!Array.from) {
    Array.from = (array) => {
        const newArray = [];
        for (let i = 0; i < array.length; i++) {
            newArray.push(array[i]);
        }
        return newArray;
    };
}
const _has_grid = CSS.supports("display", "grid");
const _display_mode = _has_grid ? "grid" : "flex";
(() => {
    const resetPageView = () => {
        for (let view of suite.textViews) {
            view.style.display = "none";
        }
    }
    const resetNavButtons = () => {
        for (let view of suite.navButtons) {
            view.classList.remove("secondary-active");
        }
    }
    const resetResponsiveNav = () => {
        suite.navIsCollapsed = suite.viewportWidth < 750;
    }
    const toggleExplorer = (hidden) => document.getElementById("explorer").style.display = hidden ? "none" : _display_mode;
    let hiddenResponsiveState = false;
    let didRunCompatibilityModeForSession = false;
    let didDoInitialNavbarClose = false;
    const suite = {
        /**
         * Switch to a given page
         * @param {string} page page id
         */
        display(page) {
            resetPageView();
            document.getElementById(page).style.display = _display_mode;
        },
        /**
         * Display a page using a navbar element
         * @param {Element} element
         */
        displayFromElement(element) {
            this.display(element.dataset.pageTarget);
            resetNavButtons();
            element.classList.add("secondary-active");
            this.textViewTitle.innerText = element.innerText;
        },
        init() {
            resetPageView();
            resetNavButtons();
            this.displayFromElement(this.navButtons[0]);
            for (let navButton of this.navButtons) {
                navButton.addEventListener("click", event => this.displayFromElement(navButton));
            }
            this.navCollapseButton.addEventListener("click", () => {
                this.navIsCollapsed = !this.navIsCollapsed;
                hiddenResponsiveState = this.navIsCollapsed;
            });
            window.addEventListener("resize", () => this.reflow());
            this.reflow();
        },
        reflow() {
            if (this.viewportWidth >= 750) {
                if (this.navIsCollapsed) {
                    this.navIsCollapsed = false;
                }
                didRunCompatibilityModeForSession = false;
                didDoInitialNavbarClose = false;
            }
            if (!this.navIsCollapsed && this.viewportWidth < 750) {
                if (!didDoInitialNavbarClose) {
                    this.navIsCollapsed = true;
                    didDoInitialNavbarClose = true;
                }
                if (hiddenResponsiveState) {
                    this.navIsCollapsed = true;
                }
                if (this.shouldUseCompatibilityMode && !didRunCompatibilityModeForSession) {
                    console.debug("Running compatibility reflow");
                    this.navIsCollapsed = !this.navIsCollapsed;
                    setTimeout(() => this.navIsCollapsed = !this.navIsCollapsed, 0);
                    didRunCompatibilityModeForSession = true;
                }
            }
        },
        get navIsCollapsed() {
            return document.getElementById("explorer").style.display === "none";
        },
        set navIsCollapsed(collapsed) {
            toggleExplorer(collapsed);
            this.textView.classList[collapsed ? "add" : "remove"]("text-view-max");
        },
        get textViews() {
            return Array.from(document.getElementsByName("text-view"));
        },
        get navButtons() {
            return Array.from(document.getElementById("explorer-items").children);
        },
        get textViewTitle() {
            return document.getElementById("tvt-wrap");
        },
        get textView() {
            return document.getElementById("text-view");
        },
        get viewportWidth() {
            return window.innerWidth;
        },
        get navCollapseButton() {
            return document.getElementById("nav-burger");
        },
        get shouldUseCompatibilityMode() {
            return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        }
    };
    window.MimicoShell = suite;
    suite.init();
})();
