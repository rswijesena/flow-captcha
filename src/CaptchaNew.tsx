import { FCMNew } from "fcmlib/lib/FCMNew";
import { CaptchaModel } from "./CaptchaModel";
import * as React from 'react';

export default class Captcha extends FCMNew {
    render() {
        return(
            <CaptchaModel 
                parent={this}
            />
        );
    }
}