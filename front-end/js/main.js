require('whatwg-fetch')

const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x },
    React = require('react'),
    ReactDOM = require('react-dom'),
    SomeComponent = () =>
        <div>This is a stateless functional component</div>,
    AnotherComponent = ({argument}) =>
        <div>`The argument of this component is {argument}`</div>

ReactDOM.render(
        <p>Yo yo whattup?</p>,
    document.getElementById('hello'))

ReactDOM.render(
    <div>
        <SomeComponent/>
        <AnotherComponent argument='bananas'/>
    </div>,
    document.getElementById('simple'))

/*
TODO
With redux, make a text box that changes an element when you type in it
*/
