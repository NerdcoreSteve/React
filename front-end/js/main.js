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
        <div>`The argument of this component is {argument}`</div>

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
Make an app that makes multiple notes
*/
const
    notesReducer = (state = {title: '', text: ''}, action) => {
        switch(action.type) {
            case 'MODIFY_TITLE':
                return {
                    ...state,
                    title: action.title
                }
            case 'MODIFY_TEXT':
                return {
                    ...state,
                    title: action.text
                }
            default:
                return state
        }
    },
    notesStore = createStore(notesReducer),
    noteStyle = {
        borderStyle: 'solid',
        borderWidth: '1px',
        padding: '10px',
        marginTop: '10px',
    },
    noteButtonsStyle = {
        marginTop: '5px',
    },
    Note = ({title, text}) =>
        <div style={noteStyle}>
            <input type='text' value={title}></input>
            <p>{text}</p>
            <textarea rows="4" cols="50" value={text}/>
            <div style={noteButtonsStyle}>
                <button type="button">+</button>
                <button type="button">-</button>
            </div>
        </div>,
    notesRender = () =>
        ReactDOM.render(
            <div>
                <Note
                    title={notesStore.getState().title}
                    text={notesStore.getState().text}
                />
            </div>,
            document.getElementById('notes'))

notesStore.subscribe(notesRender)
notesRender()
