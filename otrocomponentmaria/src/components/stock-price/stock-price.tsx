import { Component, Element, h, Listen, Prop, State, Watch } from "@stencil/core";
import { AV_API_KEY } from '../../global/global';

@Component({
    tag: 'stock-price',
    styleUrl: './stock-price.css',
    shadow: true
})

export class StockPrice {
    stockInput: HTMLInputElement;    //vamos a usar una referencia en el input
    // initialStockSymbol: string;

    @Element() el: HTMLElement;
    @State() fetchedPrice: number;
    @State() stockUserInput: string  //validar lo que el usuario tipea
    @State() stockInputValid = false;
    @State() error: string;
    @State() loading = false;

    @Prop({mutable: true, reflect:true}) stockSymbol: string;

    @Watch('stockSymbol')    //atento a cambios para ver si vuelve a hacer la peticion
    stockSymbolChanged(newValue: string, oldValue: string){
        if(newValue !== oldValue){
            this.stockUserInput =newValue;
            this.stockInputValid = true;
            this.fetchStockPrice(newValue)
        }
    }

    onUserInput = (event: Event) => {
        this.stockUserInput = (event.target as HTMLInputElement).value;
        if (this.stockUserInput.trim() !== "") this.stockInputValid = true;
        else this.stockInputValid = false;
    }

    onFetchStockPrice = (event: Event) => {
        event.preventDefault();
        // const stockSymbol = (this.el.shadowRoot.querySelector('#stock-symbol')as HTMLInputElement).value;
        this.stockSymbol = this.stockInput.value;
        // this.fetchStockPrice(stockSymbol);
    }

    componentWillLoad(){
        console.log('ComponentWillLoad-antes del render CARGARA')
        // console.log(this.stockSymbol)
    }

    componentDidLoad() {
        console.log('componentDidLoad-despues del render CARGO')
        if (this.stockSymbol) {
            // this.initialStockSymbol = this.stockSymbol;
            this.stockUserInput = this.stockSymbol;
            this.stockInputValid = true;
            this.fetchStockPrice(this.stockSymbol)
        }
    }

    componentWillUpdate(){
        console.log('ComponentWillUpdate-en actualizaciones ACTUALIZARA')
    }

    componentDidUpdate(){
        console.log('ComponentDidUpdate-ACTUALIZO')
        // if(this.stockSymbol !== this.initialStockSymbol){
        //     this.initialStockSymbol = this.stockSymbol
        //     this.fetchStockPrice(this.stockSymbol)
        // }
    }

    disconnectedCallback(){
        console.log('Disconnected-DESCARGO')
    }

    @Listen('symbolSelected', { target: 'body' })
    onStockSymbolSelected (event: CustomEvent){
        if(event.detail && event.detail !== this.stockSymbol){
            this.stockSymbol = event.detail;
        }
    }

    hostData() {return {class: this.error ? 'error' : ''}};


    fetchStockPrice(stockSymbol: string) {
        this.loading = true;
        fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stockSymbol}&apikey=${AV_API_KEY}`)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error('Invalid!')
                }
                return res.json();
            })
            .then(res => {
                if (!res['Global Quote']['05. price']) {
                    throw new Error('Invalid symbol!')
                }
                this.error = null;
                this.fetchedPrice = +res['Global Quote']['05. price'];
                this.loading = false;
            })
            .catch(err => {
                this.error = err.message;
                this.fetchedPrice = null;
                this.loading= false;
            });
    }

    
    render() {
        console.log('soy el render')
        let dataContent = <p>Please enter a symbol!</p>
        if (this.error) {
            dataContent = <p>{this.error}</p>
        }
        if (this.fetchedPrice) {
            dataContent = <p>Price: $ {this.fetchedPrice}</p>;
        }
        if(this.loading){
            dataContent = <uc-spinner></uc-spinner>
        }
        return [
            <form class="hydrated" onSubmit={this.onFetchStockPrice}>
                <input
                    id="stock-symbol"
                    ref={element => this.stockInput = element}
                    value={this.stockUserInput}
                    onInput={this.onUserInput}
                />
                <button type="submit" disabled={!this.stockInputValid || this.loading}>Fetch</button>
            </form>,
            <div>
                {dataContent}
            </div>
        ];
    }
}