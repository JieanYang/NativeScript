import { Component, OnInit, Inject, ViewContainerRef } from '@angular/core';
import { Dish } from '../shared/dish';
import { Comment } from '../shared/comment';
import { DishService } from '../services/dish.service';
import { ActivatedRoute, Params } from '@angular/router';
import { RouterExtensions } from 'nativescript-angular/router';
import 'rxjs/add/operator/switchMap';
import { FavoriteService } from '../services/favorite.service';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
// Dialogs
import { Toasty } from 'nativescript-toasty';
import { action } from 'ui/dialogs';
//Service for opening the modal comment
import { ModalDialogService, ModalDialogOptions } from 'nativescript-angular/modal-dialog';
import { commentModalComponent } from'../comment/comment.component';
//Animations and Gestures
import { Page } from 'ui/page';
import { Animation, AnimationDefinition } from 'ui/animation';
import { View } from 'ui/core/View';
import { SwipeGestureEventData, SwipeDirection } from 'ui/gestures';
import { Color } from 'color';
import * as enums from 'ui/enums';


@Component({
	selector: 'app-dishdetail',
	moduleId: module.id,
	templateUrl: './dishdetail.component.html'
	// styleUrls: ['./dishdetail.component.css']
})
export class DishdetailComponent implements OnInit {

	dish: Dish;
	comment: Comment;
	errMess: string;
	
	// buttons
	avgstars: string;
	numcomments: number;
	favorite: boolean = false;

	//Animations and Gestures
	showComments: boolean = false;
	cardImage: View;
	commentList: View;
	cardLayout: View;
	commentLabel: View;

	constructor(private dishservice: DishService,
		private route: ActivatedRoute,
		private routerExtensions: RouterExtensions,
		private favoriteservice: FavoriteService,
		private fonticon: TNSFontIconService,
		@Inject('BaseURL') private BaseURL,
		//Service for opening the modal comment
		private modalService: ModalDialogService,
		private vcRef: ViewContainerRef,
		//Animation and Gestures
		private page: Page) {}

	ngOnInit() {
		this.route.params
			.switchMap((params: Params) => this.dishservice.getDish(+params['id']))
			.subscribe(dish => {
				this.dish = dish;
				this.favorite = this.favoriteservice.isFavorite(this.dish.id);
				this.numcomments = this.dish.comments.length;

				let total = 0;
				this.dish.comments.forEach(comment => total += comment.rating);
				this.avgstars = (total/this.numcomments).toFixed(2);
			},
				errmess => {this.dish = null; this.errMess = <any>errmess;});
	}

	goBack(): void {
		this.routerExtensions.back(); 
	}

	addToFavorites() {
		if(!this.favorite) {
			console.log('Adding to Favorites', this.dish.id);
			this.favorite = this.favoriteservice.addFavorite(this.dish.id);
			const toast = new Toasty("Added Dish " + this.dish.id, "short", "bottom");
			toast.show();
		}
	}

	createModalView() {
		let options: ModalDialogOptions ={
		  viewContainerRef: this.vcRef,
		  context: null,
		  fullscreen: false
		};

		this.modalService.showModal(commentModalComponent, options)
		  .then((result: Comment) => {
		    this.dish.comments.push(result);
		    this.numcomments = this.dish.comments.length;
		    let total = 0;
		    this.dish.comments.forEach(comment => total += comment.rating);
		    this.avgstars = (total/this.numcomments).toFixed(2);
		  });
	}

	openActionDialog() {
		let options = {
			title: "Actions",
			message: "Choose one action",
			cancelButtonText: "Cancel",
			actions: ["Add to Favorites", "Add Comment"]
		};

		action(options).then((result) => {
			if(result === "Add to Favorites"){
				this.addToFavorites();
			} else if(result === "Add Comment") {
				this.createModalView();
			}
		});
	}

	onSwipe(args: SwipeGestureEventData) {
		if(this.dish) {
			this.cardImage = this.page.getViewById<View>("cardImage");
			this.cardLayout = this.page.getViewById<View>("cardLayout");
			this.commentLabel = this.page.getViewById<View>("commentLabel");
			this.commentList = this.page.getViewById<View>("commentList");

			if(args.direction === SwipeDirection.up && !this.showComments) {
				this.animateUp();
			} else if(args.direction === SwipeDirection.down && this.showComments) {
				this.showComments = false;
				this.animateDown();
			}
		}
	}

	showAndHideComments() {
		this.cardImage = this.page.getViewById<View>("cardImage");
		this.cardLayout = this.page.getViewById<View>("cardLayout");
		this.commentLabel = this.page.getViewById<View>("commentLabel");
		this.commentList = this.page.getViewById<View>("commentList");

		if(!this.showComments) {
			this.animateUp();
		} else if(this.showComments) {
			this.showComments = false;
			this.animateDown();
		}
	}

	animateUp() {
		let definitions = new Array<AnimationDefinition>();
		let a1: AnimationDefinition = {
			target: this.cardImage,
			scale: {x: 1, y: 0},
			translate: {x: 0, y: -200},
			opacity: 0,
			duration: 500,
			curve: enums.AnimationCurve.easeIn
		};
		definitions.push(a1);

		let a2: AnimationDefinition = {
			target: this.cardLayout,
			translate: {x: 0, y: -380},
			backgroundColor: new Color('#ffc107'),
			duration: 500,
			curve: enums.AnimationCurve.easeIn
		};
		definitions.push(a2);

		let a3: AnimationDefinition = {
			target: this.commentLabel,
			translate: {x: 0, y: -380},
			duration: 500,
			curve: enums.AnimationCurve.easeIn
		}
		definitions.push(a3);

		let a4: AnimationDefinition = {
			target: this.commentList,
			translate: {x: 0, y: -380},
			duration: 500,
			curve: enums.AnimationCurve.easeIn
		}
		definitions.push(a4);

		let animationSet = new Animation(definitions);
		animationSet.play().then(() => {
			this.showComments = true;
			console.log("showComments == "+this.showComments);
		})
		.catch((e) => {
			console.log(e.message);
		});

	}

	animateDown() {
		let definitions = new Array<AnimationDefinition>();
		let a1: AnimationDefinition = {
			target: this.cardImage,
			scale: {x: 1, y: 1},
			translate: {x: 0, y: 0},
			opacity: 1,
			duration: 500,
			curve: enums.AnimationCurve.easeIn
		};
		definitions.push(a1);

		let a2: AnimationDefinition = {
			target: this.cardLayout,
			translate: {x: 0, y: 0},
			backgroundColor: new Color('#ffffff'),
			duration: 500,
			curve: enums.AnimationCurve.easeIn
		};
		definitions.push(a2);

		let a3: AnimationDefinition = {
			target: this.commentLabel,
			translate: {x: 0, y: 0},
			duration: 500,
			curve: enums.AnimationCurve.easeIn
		}
		definitions.push(a3);

		let a4: AnimationDefinition = {
			target: this.commentList,
			translate: {x: 0, y: 0},
			duration: 500,
			curve: enums.AnimationCurve.easeIn
		}
		definitions.push(a4);

		let animationSet = new Animation(definitions);
		animationSet.play().then(() => {
			console.log("showComments == "+this.showComments);
		})
		.catch((e) => {
			console.log(e.message);
		});
	}

}