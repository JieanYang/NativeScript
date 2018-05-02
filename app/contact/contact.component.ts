import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
//Fonticon
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
//SendEmail
import * as Email from 'nativescript-email';


@Component({
	selector: 'app-contact',
	moduleId: module.id,
	templateUrl: './contact.component.html'
})
export class ContactComponent extends DrawerPage implements OnInit {

	constructor(private changeDetectorRef: ChangeDetectorRef,
		private fonticon: TNSFontIconService) {
		super(changeDetectorRef);
	}

	ngOnInit() {

	}

	sendEmail() {
		Email.available()
			.then((avail: boolean) => {
				if(avail) {
					Email.compose({
						to: ['confusion@food.net'],
						subject: '[Confusion]: Query',
						body: 'Dear Sir/Madam:'
					});
				} else {
					console.log("No Email Configured");
				}
			})
	}

}