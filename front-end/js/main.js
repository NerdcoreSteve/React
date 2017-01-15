require('whatwg-fetch')

const
    R = require('ramda'),
    Rx = require('rx'),
    tap = x => { console.log(x); return x },
    React = require('react'),
    ReactDOM = require('react-dom')

//Simple hello world
ReactDOM.render(
        <p>Yo yo whattup?</p>,
    document.getElementById('hello'))

//stateless functional components
const
    SomeComponent = () =>
        <div>This is a stateless functional component</div>,
    AnotherComponent = ({argument}) =>
        <div>The argument of this component is {argument}</div>

ReactDOM.render(
    <div>
        <SomeComponent/>
        <AnotherComponent argument='bananas'/>
    </div>,
    document.getElementById('simple'))

//Simple react redux example
const
    {createStore} = require('redux'),
    reducer = (state = '', action) => {
        switch(action.type) {
            case 'ADD_TEXT':
                return action.text
            default:
                return state
        }
    },
    store = createStore(reducer),
    render = () =>
        ReactDOM.render(
            <div>
                <p>{store.getState()}</p>
                <input
                    type="text"
                    onChange={({target:{value: text}}) => store.dispatch({type: 'ADD_TEXT', text})}/>
            </div>,
            document.getElementById('textfield'))

store.subscribe(render)
render()

/*
TODO
Make a more complicated app
This app doesn't quite work. I need something more complicated, But I'm not saving notes to a server so it's just a list of components, each just a text field and text area. Nothing more is saved or displayed.
*/
const
    kanbanReducer = (state = '', action) => {
        switch(action.type) {
            case 'ADD_TEXT':
                return action.text
            default:
                return state
        }
    },
    kanbanStore = createStore(kanbanReducer),
    kanbanStyle = {
        marginTop: '10px'
    },
    colStyle = {
        backgroundColor: '#c7ffa0',
        padding: '5px',
        marginLeft: '5px',
        marginRight: '5px',
        float: 'left',
        borderRadius: '5px',
        width: '200px',
        height: '300px'
    },
    headerStyle = {
        backgroundColor: '#75aaff',
        borderRadius: '5px',
        padding: '5px',
        marginTop: '0px',
        textAlign: 'center'
    },
    /*
        Arrow buttons to move columns and go up and down
        on a column. Each column has a plus button to add
        items. Each item has a minus button to remove.

    */
    Item = ({title, text}) =>
        <div>
            <input type="text"/>
            <textarea rows="4" cols="25"/>
        </div>,
    kanbanRender = () =>
        ReactDOM.render(
            <div style={kanbanStyle}>
                <div style={colStyle}>
                    <h3 style={headerStyle}>to do</h3>
                    <Item/>
                </div>
                <div style={colStyle}>
                    <h3 style={headerStyle}>doing</h3>
                    <Item/>
                </div>
                <div style={colStyle}>
                    <h3 style={headerStyle}>done</h3>
                    <Item/>
                </div>
            </div>,
            document.getElementById('kanban'))

kanbanStore.subscribe(kanbanRender)
kanbanRender()
