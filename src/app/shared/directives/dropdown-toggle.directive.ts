import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
    selector: '[appDropdownToggle]'
})
export class DropdownToggleDirective {

    constructor(private el: ElementRef, private renderer: Renderer2) { }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        const dropdownMenu = this.el.nativeElement.nextElementSibling;
        const isMenuOpen = dropdownMenu.classList.contains('show');

        // Toggle the 'show' class on the dropdown menu
        if (isMenuOpen) {
            this.renderer.removeClass(dropdownMenu, 'show');
        } else {
            this.renderer.addClass(dropdownMenu, 'show');
        }

        // Prevent the default action of the click event
        event.preventDefault();
        event.stopPropagation();
    }

}
