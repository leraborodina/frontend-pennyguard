import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';
import { NavbarComponent } from '../components/navbar/navbar.component';
 

@Directive({
    selector: '[appDropdownToggle]'
})
export class DropdownToggleDirective {
    @Input() menuName!: string;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private navbarComponent: NavbarComponent
    ) { }

    @HostListener('click', ['$event'])
    onClick(event: Event) {
        this.navbarComponent.toggleDropdownMenu(this.menuName);
        event.preventDefault();
        event.stopPropagation();
    }
}
