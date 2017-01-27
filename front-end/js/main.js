require('whatwg-fetch')

const
    R = require('ramda'),
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

//map example
const
    Row = ({text, style={}}) => <tr><td style={style}>{text}</td></tr>,
    Table = ({list, style={}}) =>
        <table style={style}>
            <tbody>
                {list.map((text, i) => <Row style={style} key={i} text={text}/>)}
            </tbody>
        </table>

ReactDOM.render(
    <Table list={['stuff', 'and', 'things']}/>,
    document.getElementById('map'))

//style example
const tableStyle = {border: '1px solid black'}
ReactDOM.render(
    <Table style={tableStyle} list={'each word will be a row'.split(' ')}/>,
    document.getElementById('stylemap'))

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

const
    kanbanInitialState = {
        nextKey: 1,
        columns: [
            {
                key: 1,
                heading: 'to do',
                items: []
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
    findItem = id => R.find(R.propEq('key', id)),
    getItemIndex = 
        (id, columns) =>
            R.pipe(
                R.map(R.prop('items')),
                R.findIndex(findItem(id)))
                    (columns),
    getItem = 
        (colIndex, id, columns) =>
            R.pipe(
                R.prop(colIndex),
                R.prop('items'),
                findItem(id))
                    (columns),
    kanbanReducer = (state = kanbanInitialState, action) => {
        switch(action.type) {
            case 'CHANGE_ITEM_TITLE':
                return changeItem({title: action.title}, action.id, state)
            case 'CHANGE_ITEM_DESCRIPTION':
                return changeItem({description: action.description}, action.id, state)
            case 'ADD_ITEM':
                return {
                    ...state,
                    nextKey: state.nextKey + 1,
                    columns: state.columns.map(col =>
                        col.key === action.id
                            ? ({
                                ...col,
                                items: [{
                                    key: state.nextKey,
                                    title: '',
                                    description: ''
                                }]
                                    .concat(col.items)
                            })
                            : col)
                }
            case 'REMOVE_ITEM':
                return {
                    ...state,
                    columns: state.columns.map(
                        col => ({
                            ...col,
                            items: col.items.filter(item => item.key !== action.id)
                        }))
                }
            case 'MOVE_ITEM':
                switch(action.direction) {
                    case 'up':
                        return {
                            ...state,
                            columns: state.columns.map(
                                col => ({
                                    ...col,
                                    items: col.items.reduce(
                                        (items, item) =>
                                            item.key === action.id
                                                ? R.dropLast(1, items)
                                                    .concat(item)
                                                    .concat(R.last(items))
                                                    .filter(x => x) //sometimes last is undefined
                                                : items.concat([item]),
                                        [])
                                }))
                        }
                    case 'down':
                        return {
                            ...state,
                            columns: state.columns.map(
                                col => ({
                                    ...col,
                                    items: col.items.reduceRight(
                                        (items, item) =>
                                            item.key === action.id && col.items.length > 0
                                                ? [R.head(items)]
                                                    .concat(item)
                                                    .concat(R.tail(items))
                                                    .filter(x => x) //head is sometimes undefined
                                                : [item].concat(items),
                                        [])
                                }))
                        }
                    case 'left':
                        return (() => {
                            const
                                colIndex = getItemIndex(action.id, state.columns),
                                item = getItem(colIndex, action.id, state.columns)

                            return {
                                ...state,
                                columns: colIndex > 0
                                    ? R.pipe(
                                        R.map(
                                            R.over(
                                                R.lensProp('items'),
                                                R.reject(R.propEq('key', action.id)))),
                                        R.adjust(
                                            R.over(
                                                R.lensProp('items'),
                                                R.append(item)),
                                            colIndex - 1))
                                                (state.columns)
                                    : state.columns
                            }
                        })()
                    case 'right':
                        return (() => {
                            const
                                colIndex = getItemIndex(action.id, state.columns),
                                item = getItem(colIndex, action.id, state.columns)

                            return {
                                ...state,
                                columns: colIndex < state.columns.length - 1
                                    ? R.pipe(
                                        R.map(
                                            R.over(
                                                R.lensProp('items'),
                                                R.reject(R.propEq('key', action.id)))),
                                        R.adjust(
                                            R.over(
                                                R.lensProp('items'),
                                                R.append(item)),
                                            colIndex + 1))
                                                (state.columns)
                                    : state.columns
                            }
                        })()
                    default:
                        return state
                }
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
            <button
                type="button"
                onClick={() => kanbanStore.dispatch({type: 'REMOVE_ITEM', id})}
                style={{width: '170px', fontSize: '90%'}}>
                remove
            </button>
            <br/>
            {[
                {key: 1, char: '▲', direction: 'up'},
                {key: 2, char: '▼', direction: 'down'},
                {key: 3, char: '◀', direction: 'left'},
                {key: 4, char: '▶', direction: 'right'}
            ].map(({key, char, direction}) =>
                <button
                    key={key}
                    type="button"
                    onClick={() => kanbanStore.dispatch({type: 'MOVE_ITEM', direction, id})}
                    style={itemButtonStyle}>
                    {char}
                </button>)}
        </div>,
    addButtonStyle = {width: '200px', marginBottom: '10px'},
    Column = ({id, heading, items}) =>
        <div style={colStyle}>
            <h3 style={headerStyle}>{heading}</h3>
            <button
                type="button"
                onClick={() => kanbanStore.dispatch({type: 'ADD_ITEM', id})}
                style={addButtonStyle}>
                +
            </button>
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
                            id={column.key}
                            heading={column.heading}
                            items={column.items}/>)}
            </div>,
            document.getElementById('kanban'))

kanbanStore.subscribe(kanbanRender)
kanbanRender()
