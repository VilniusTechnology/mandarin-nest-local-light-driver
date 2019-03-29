import { RGBCCTColors } from "./rgb-cct-colors-model";

export class LedEmulatorMessage {
    constructor(public from: string, public content: string, public color: RGBCCTColors) {}
}