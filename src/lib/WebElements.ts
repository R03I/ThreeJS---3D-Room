export class WebElements {
    public static createButton(text: string, styles: string, onClick: () => void): HTMLButtonElement {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.cssText = styles;
        button.addEventListener('click', onClick);
        return button;
    }

    public static createScrollableContainer(imageSrc: string, closeButtonStyles: string): HTMLDivElement {
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            width: 80%;
            height: 80%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            overflow-y: auto;
            background: white;
            display: none;
            z-index: 1000;
        `;

        const image = document.createElement('img');
        image.src = imageSrc;
        image.style.width = '100%';
        container.appendChild(image);

        const closeButton = this.createButton('X', closeButtonStyles, () => {
            container.style.display = 'none';
        });
        container.appendChild(closeButton);

        return container;
    }
}
