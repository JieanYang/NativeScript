import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
//Fonticon
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
//SendEmail
import * as Email from 'nativescript-email';
//Phone call
import * as Phone from 'nativescript-phone';


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

	callRestaurant() {
		Phone.dial('852 1234 5678', true);
		/*Don't support Andoid 6.0 with false
		Phone.dial('852 1234 5678', false);*/

		/*Phone.sms(["852 1234 5678"],"My Message")
		.then(function(args){
		        /// args.reponse: "success", "cancelled", "failed"
		        console.log(JSON.stringify(args));
		    },
		    function(err){
		        console.log("Error: " + err);
		    }
		);*/

	}

}