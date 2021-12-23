import { Component, h, Method, Prop, State} from "@stencil/core";

@Component({
    tag:'uc-side-drawer',
    styleUrl: './side-drawer.css',
    shadow: true,
})

export class SideDrawer {
    @State() showContactInfo = false;
    @Prop({reflect: true}) title: string;
    @Prop({reflect: true, mutable:true}) opened:boolean;

    onCloseDrawer = () => {
        this.opened = false
    }

    onContentChange = (content: string) => {
        this.showContactInfo = content === 'contact';
    }

    @Method()
    open(){
        this.opened = true
    }

    render(){
        let mainContent = <slot />;
        if(this.showContactInfo) {   //si esto esta en true, es decir esta dandose click en contact
            mainContent = (
                <div id="contact-information">
                    <h1>Contact Information</h1>
                    <p>You can reach us via phone and email.</p>
                    <ul>
                        <li>Phone: 325542157</li>
                        <li>E-mail: <a href="mailto:something@something.com">something@something.com</a></li>
                    </ul>
                </div>
            )
        }
        return [
            <div class="backdrop" onClick={this.onCloseDrawer}></div>,
            <aside>
                <header>
                    <h1>{this.title}</h1>
                    <button onClick={this.onCloseDrawer}>X</button>
                </header>
                <section id="tabs">
                    <button class={!this.showContactInfo ? "active" : ""} onClick={this.onContentChange.bind(this, 'div')}>Navegation</button>
                    <button class={this.showContactInfo ? "active" : ""}onClick={this.onContentChange.bind(this,'contact')}>Contact</button>
                </section>
                <main>
                    {mainContent}
                </main>
            </aside>
        ]
    }
}