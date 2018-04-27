import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Page } from 'ui/page';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TextField } from 'ui/text-field';
import { Slider } from 'ui/slider';

import { Comment } from '../shared/comment';

@Component({
	moduleId: module.id,
	templateUrl: './comment.component.html'
})
export class commentModalComponent implements OnInit {

	commentForm: FormGroup;

	constructor(private params: ModalDialogParams,
		private page: Page,
		private formBuilder: FormBuilder) {

		this.commentForm = this.formBuilder.group({
			author: ['', Validators.required],
			rating: 5,
			comment: ['', Validators.required]
		})
	}

	ngOnInit() {

	}

    onRatingChange(args) {
        let slider = <Slider>args.object;
        this.commentForm.patchValue({ rating: slider.value });
    }


    onSubmit() {
        let submitComment : Comment;
        submitComment = this.commentForm.value;
        submitComment.date = new Date().toISOString();
        this.params.closeCallback(submitComment);

        /* Old way
        var comment = {
            rating: this.commentForm.get('rating').value,
            comment: this.commentForm.controls['comment'].value,
            author: this.commentForm.controls['author'].value,
            date: new Date().toISOString()
        }
        this.params.closeCallback(comment);*/
	}

    /* It has two way binding, we don't need this two functions
    onAuthorChange(args) {
        let textField = <TextField>args.object;
        this.commentForm.patchValue({ author: textField.text });
    }
    onCommentTextFieldChange(args) {
        let textField = <TextField>args.object;
        this.commentForm.patchValue({ comment: textField.text });
    }*/

}