export class HUD {
  private element: HTMLElement;

  constructor() {  console.log("HUD constructor started");
    this.element = document.getElementById('hud') as HTMLElement;
    if (!this.element) {
      console.error("HUD element not found! Make sure you have a <div id='hud'> in your HTML.");
    }
  }

  public update(text: string): void {
    if (this.element) {
      // Use <pre> to preserve whitespace and newlines
      this.element.innerHTML = `<pre>${text}</pre>`;
    }
  }
}
