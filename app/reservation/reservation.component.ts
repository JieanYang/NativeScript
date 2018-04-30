import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { ReservationModalComponent} from '../reservationmodal/reservationmodal.component';
//Animations and Gestures
import { Page } from 'ui/page';
import { Animation, AnimationDefinition } from 'ui/animation';
import { View } from 'ui/core/View';
import * as enums from 'ui/enums';
// Service storage Couchbase, database no SQL
import { CouchbaseService } from '../services/couchbase.service';


@Component({
	selector: 'app-reservation',
	moduleId: module.id,
	templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

	reservation: FormGroup;

	reservationEnter: View;
	reservationShow: View;
	showReservationEnter: boolean = false;
	//storage
	reservationArray: Array<Object>;
	docId: string = "reservations";

	constructor(private changeDetectorRef: ChangeDetectorRef,
		private formBuilder: FormBuilder,
		private modalService: ModalDialogService,
		private vcRef: ViewContainerRef,
		//Animations and Gestures
		private page: Page,
		//storage
		private couchbaseService: CouchbaseService) {
		super(changeDetectorRef);

		this.reservation = this.formBuilder.group({
			guests: 3,
			smoking: false,
			dateTime: ['', Validators.required]
		});

		//If we have the old data which isn't the data array in the database 
		//It will produce an error -> this.couchbaseService.deleteDocument(this.docId);
		this.reservationArray = [];

		let doc = this.couchbaseService.getDocument(this.docId);
		if (doc == null) {
			this.couchbaseService.createDocument({"reservations": []}, this.docId);
		} else {
			this.reservationArray = doc.reservations;
		}
	}

	ngOnInit() {
		
	}

	onSmokingChecked(args) {
		let smokingSwitch = <Switch>args.object;
		if (smokingSwitch.checked) {
			this.reservation.patchValue({ smoking: true });
		} else {
			this.reservation.patchValue({ smoking: false });
		}
	}

	onGuestChange(args) {
		let textField = <TextField>args.object;
		this.reservation.patchValue({ guests: textField.text });
	}

	onDateTimeChange(args) {
		let textField = <TextField>args.object;
		this.reservation.patchValue({ dateTime: textField.text });
	}

	onSubmit() {
		console.log("one reservation -> " + JSON.stringify(this.reservation.value));
		this.hideAndShowReservation();

		this.reservationArray.push(this.reservation.value);
		this.couchbaseService.updateDocument(this.docId, {"reservations": this.reservationArray});
		console.log("all reservations -> " + JSON.stringify(this.couchbaseService.getDocument(this.docId)));
	}

	createModalView(args) {
		let options: ModalDialogOptions = {
			viewContainerRef: this.vcRef,
			context: args,
			fullscreen: false
		};

		this.modalService.showModal(ReservationModalComponent, options)
			.then((result: any) => {
				if (args === "guest") {
					this.reservation.patchValue({ guests: result });
				} else if (args === "date-time") {
					this.reservation.patchValue({ dateTime: result });
				}
			})
	}


	hideAndShowReservation() {
		this.reservationEnter = this.page.getViewById<View>("reservationEnter");
		this.reservationShow = this.page.getViewById<View>('reservationShow');
		this.animateHide();
	}

	animateHide() {
		let definitions = new Array<AnimationDefinition>();

		let a1: AnimationDefinition = {
			target: this.reservationEnter,
			scale: {x: 0, y: 0},
			opacity: 0,
			duration: 500
		};
		definitions.push(a1);

		let a2: AnimationDefinition ={
			target: this.reservationShow,
			scale: {x: 0, y: 0},
			opacity:0
		};
		definitions.push(a2);
		

		let animationSet = new Animation(definitions);
		animationSet.play().then(() => {
			this.animateShow();
		})
		.catch((e) => {
			console.log(e.message);
		});
	}

	animateShow() {
		this.showReservationEnter = true;
		let definitions = new Array<AnimationDefinition>();

		let a3: AnimationDefinition = {
		target: this.reservationShow,
		scale: {x: 1, y: 1},
		opacity: 1,
		duration: 500
		};
		definitions.push(a3);

		let animationSet = new Animation(definitions);
		animationSet.play().then(() => {
			console.log("done");
		})
		.catch((e) => {
			console.log(e.message);
		});
	}

}