/**
 * Example usage of WinnetouJS with TypeScript
 * This file demonstrates how to use WinnetouJS with full type safety
 */

import { Winnetou } from "../src/winnetou";
import { Router } from "../modules/router";
import { getElements, addClass, onClick } from "../modules/select";
import { updateTranslations, changeLang } from "../modules/translations";
import { Constructos } from "../src/constructos";

// Define types locally for this example
type SelectorType = string | Element | Element[];
interface ConstructoOptions {
  identifier?: string;
  clear?: boolean;
  reverse?: boolean;
  vdom?: DocumentFragment;
  replace?: boolean;
}

// Example 1: Using mutables with type safety
function setupMutables(): void {
  // Set a mutable value
  Winnetou.setMutable("currentUser", "john_doe");

  // Get a mutable value (properly typed as string | null)
  const currentUser = Winnetou.getMutable("currentUser");
  if (currentUser) {
    console.log(`Current user: ${currentUser}`);
  }

  // Initialize a temporary mutable
  const tempMutable = Winnetou.initMutable("temporary_value");
  Winnetou.setMutableNotPersistent(tempMutable, "updated_value");
}

// Example 2: Router with type-checked routes
function setupRouter(): void {
  Router.createRoutes(
    {
      "/": () => {
        console.log("Home page");
        loadHomePage();
      },
      "/about": () => {
        console.log("About page");
        loadAboutPage();
      },
      "/user/:id": (userId: string) => {
        console.log(`Loading user profile for ID: ${userId}`);
        loadUserProfile(userId);
      },
      "/settings/:section/:tab": (section: string, tab: string) => {
        console.log(`Loading settings: ${section} -> ${tab}`);
        loadSettings(section, tab);
      },
    },
    {
      onBack: (route: string) => {
        console.log(`Going back to route: ${route}`);
      },
      onGo: (route: string) => {
        console.log(`Navigating to route: ${route}`);
      },
    }
  );
}

// Example 3: DOM manipulation with type safety
function setupDOMInteraction(): void {
  // Get elements with proper typing
  const buttons = getElements(".btn"); // Element[]

  // Add classes with type checking
  addClass(buttons, "interactive");

  // Add click handlers with proper typing
  onClick(buttons, (event: Event) => {
    const target = event.target as HTMLElement;
    console.log(`Button clicked: ${target.textContent}`);

    // Toggle visual state
    target.classList.toggle("active");
  });

  // Using Winnetou.fx for inline event handlers
  const dynamicHandler = Winnetou.fx(
    (element: HTMLElement, message: string) => {
      element.style.background = "lightblue";
      alert(message);
    },
    "this",
    "Hello from TypeScript!"
  );

  console.log(`Generated handler: ${dynamicHandler}`);
}

// Example 4: Translations with type safety
async function setupTranslations(): Promise<void> {
  try {
    await updateTranslations({
      stringsClass: Winnetou.strings,
      translationsPublicPath: "/assets/translations",
    });

    console.log("Translations loaded successfully");
  } catch (error) {
    console.error("Failed to load translations:", error);
  }
}

// Example 5: Custom Constructo with TypeScript
class CustomConstructo extends Constructos {
  private componentId: string;
  private props: Record<string, any>;

  constructor(props: Record<string, any>, options: ConstructoOptions = {}) {
    super();

    this.componentId = this._getIdentifier(options.identifier) as string;
    this.props = this._mutableToString(props);

    // Save mutable tracking
    this._saveUsingMutable(
      `custom-${this.componentId}`,
      props,
      options,
      CustomConstructo
    );
  }

  create(
    output: SelectorType,
    options?: ConstructoOptions
  ): { customElement: Element | null } {
    const component = this.generateHTML();
    this.attachToDOM(component, output, options);

    return {
      customElement:
        typeof output === "string"
          ? document.querySelector(output)
          : Array.isArray(output)
          ? output[0]
          : output,
    };
  }

  private generateHTML(): string {
    return `
      <div id="custom-${this.componentId}" class="custom-component">
        <h3>${this.props.title || "Default Title"}</h3>
        <p>${this.props.content || "Default content"}</p>
        <button onclick="${Winnetou.fx(this.handleClick.bind(this), "this")}">
          Click Me
        </button>
      </div>
    `;
  }

  private handleClick(button: HTMLElement): void {
    button.textContent = "Clicked!";
    if (button instanceof HTMLButtonElement) {
      button.disabled = true;
    }
  }
}

// Example 6: Application initialization
function initializeApp(): void {
  // Start mutation observer for constructo lifecycle
  Winnetou.mutations.start();

  // Setup all functionality
  setupMutables();
  setupRouter();
  setupDOMInteraction();
  setupTranslations();

  // Create custom constructo
  const myConstructo = new CustomConstructo({
    title: "Welcome to WinnetouJS",
    content: "This is a TypeScript example!",
  });

  const { customElement } = myConstructo.create("#app");
  console.log("Custom constructo created:", customElement);

  // Navigate to initial route
  Router.navigate("/", false);
}

// Helper functions
function loadHomePage(): void {
  console.log("Loading home page content...");
}

function loadAboutPage(): void {
  console.log("Loading about page content...");
}

function loadUserProfile(userId: string): void {
  console.log(`Loading user profile for user: ${userId}`);
}

function loadSettings(section: string, tab: string): void {
  console.log(`Loading settings section: ${section}, tab: ${tab}`);
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  initializeApp();
}

// Export for module usage
export {
  CustomConstructo,
  initializeApp,
  setupMutables,
  setupRouter,
  setupDOMInteraction,
  setupTranslations,
};
