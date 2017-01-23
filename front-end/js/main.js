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
    kanbanInitialState = {
        nextKey: 4,
        columns: [
            {
                key: 1,
                heading: 'to do',
                items: [
                    {
                        key: 1,
                        title: 'Buy a grizzly bear',
                        description: 'I think the thing I need most in my life is a giant furry pig with claws'
                    }
                ]
            },
            {
                key: 2,
                heading: 'doing',
                items: []
            },
            {
                key: 3,
                heading: 'done',
                items: []
            }
        ]
    },
    changeItem = (changes, id, state) => ({
        ...state,
        columns: state.columns.map(
            col => ({
                ...col,
                items: col.items.map(item =>
                    item.key === id
                        ? {...item, ...changes}
                        : item)
            }))
    }),
    kanbanReducer = (state = kanbanInitialState, action) => {
        switch(action.type) {
            case 'CHANGE_ITEM_TITLE':
                return changeItem({title: action.title}, action.id, state)
            case 'CHANGE_ITEM_DESCRIPTION':
                return changeItem({description: action.description}, action.id, state)
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
        height: '500px'
    },
    headerStyle = {
        backgroundColor: '#75aaff',
        borderRadius: '5px',
        padding: '5px',
        marginTop: '0px',
        textAlign: 'center'
    },
    itemStyle = {
        backgroundColor: '#f4cb42',
        borderRadius: '5px',
        padding: '5px',
        marginTop: '0px',
        textAlign: 'center'
    },
    itemInputStyle = {
        marginBottom: '5px',
        borderRadius: '5px'
    },
    itemButtonStyle = {
        width: '42px'
    },
    Item = ({id, title, description}) =>
        <div style={itemStyle}>
            <input
                type="text"
                value={title}
                onChange = {({target:{value: title}}) =>
                    kanbanStore.dispatch({type: 'CHANGE_ITEM_TITLE', id, title})}
                cols="25"
                style={{...itemInputStyle, width: '170px', borderStyle: 'solid'}}/>
            <textarea
                value={description}
                onChange = {({target:{value: description}}) =>
                    kanbanStore.dispatch({type: 'CHANGE_ITEM_DESCRIPTION', id, description})}
                rows="4"
                cols="25"
                style={{...itemInputStyle, resize: 'none'}}/>
            <button type="button" style={{width: '170px', fontSize: '90%'}}>remove</button>
            <br/>
            <button type="button" style={itemButtonStyle}>▲</button>
            <button type="button" style={itemButtonStyle}>▼</button>
            <button type="button" style={itemButtonStyle}>◀</button>
            <button type="button" style={itemButtonStyle}>▶</button>
        </div>,
    addButtonStyle = {width: '200px', marginBottom: '10px'},
    Column = ({heading, items}) =>
        <div style={colStyle}>
            <h3 style={headerStyle}>{heading}</h3>
            <button type="button" style={addButtonStyle}>+</button>
            {items.map(({key, title, description}) =>
                <Item key={key} id={key} title={title} description={description}/>)}
        </div>,
    kanbanRender = () =>
        ReactDOM.render(
            <div style={kanbanStyle}>
                {kanbanStore.getState().columns.map(
                    column =>
                        <Column
                            key={column.key}
                            heading={column.heading}
                            items={column.items}/>)}
            </div>,
            document.getElementById('kanban'))

kanbanStore.subscribe(kanbanRender)
kanbanRender()
