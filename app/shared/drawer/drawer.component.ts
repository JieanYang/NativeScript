import {Component} from "@angular/core";
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
// Login
import { login, LoginResult } from 'ui/dialogs';
// Storage application setting
import { getString, setString } from 'application-settings';


@Component({
    selector: 'drawer-content',
    templateUrl: './shared/drawer/drawer.component.html',
})
export class DrawerComponent {

    constructor(private fonticon: TNSFontIconService) {
    }

    displayLoginDialog() {
    	let options = {
            title: "Login",
            message: 'Type Your Login Credentials',
            userName: getString("userName", ""),
            password: getString("password",""),
            okButtonText: "Login",
            cancelButtonText: "Cancel"
        }

    	login(options)
            .then((loginResult: LoginResult) => {
                // console.log('result boolean ->' + loginResult.result); 
            	if(loginResult.result === true) {
	                setString("userName", loginResult.userName);
	                setString("password", loginResult.password);
	                console.log('Login successed'); 
            	}else {
            		console.log('Login cancelled'); 
            	}
            },() => { 
            	console.log('Login cancelled'); 
        });
    }

}