import { Component, h, Prop, State } from "@stencil/core";

@Component({
    tag: 'uc-tooltip',
    styleUrl: './tooltip.css',
    shadow: true
})

export class Tooltip{
    @State() tooltipVisible = false;
    @Prop() text: string

    onToggleTooltip = () => {
        this.tooltipVisible = !this.tooltipVisible  //seteo el estado con el onclick
    }


    render(){
        let tooltip = null;
        if(this.tooltipVisible){
            tooltip = <div id="tooltip-text">{this.text}</div>
        }
        return [
            <slot />,
            <span id="tooltip-icon" onClick={this.onToggleTooltip}>?</span>,
            tooltip
        ];
    }
}