import { LedStateModel } from './led-state-model';
import { LedModeModel } from './led-mode-model';
import { LedColorStateModel } from "./led-color-state-model";

export class LedControllerStateModel {
    public red: LedColorStateModel; 
    public green: LedColorStateModel; 
    public blue: LedColorStateModel; 
    public warmWhite: LedColorStateModel; 
    public coldWhite: LedColorStateModel;   
    public ledMode: LedModeModel;  
    public ledState: LedStateModel; 
}