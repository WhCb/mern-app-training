import React, { Component } from 'react'

// Utilities 
import axios from 'axios'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      data: [],
      id: 0,
      message: null,
      intervalIsSet: false,
      idToDelete: null,
      idToUpdate:null,
      objectToUpdate: null,
    }

    this.getDataFromDB = this.getDataFromDB.bind(this)
    this.deleteFromDB = this.deleteFromDB.bind(this)
    this.updateDB = this.updateDB.bind(this)
    this.putDataToDB = this.putDataToDB.bind(this)
  }

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDB()
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDB = () => {
    fetch('http://localhost:3001/api/getData')
      .then(data => data.json())
      .then(({ data }) => { this.setState({ data }) })
  }

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB (message) {
    let currentIds = this.state.data.map(data => data.id)
    let idToBeAdded = 0

    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded
    }

    const requestUri = 'http://localhost:3001/api/putData'
    const requestData = { id: idToBeAdded, message }

    axios.post(requestUri, requestData)
      .then(res => { this.getDataFromDB() })
  }

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB (idToDelete) {
    let objIdToDelete = null
    
    this.state.data.forEach(({ id, _id }) => {
      if (parseInt(id) === parseInt(idToDelete)) {
        objIdToDelete = _id
      }
    })

    const requestUri = 'http://localhost:3001/api/deleteData'
    const requestData = { id: objIdToDelete }

    axios.post(requestUri, requestData)
      .then(res => { this.getDataFromDB() })
  }

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB (idToUpdate, updateToAppy) {
    let objIdToUpdate = null

    parseInt(idToUpdate)

    this.state.data.forEach(({ id, _id }) => {
      if (parseInt(id) === parseInt(idToUpdate)) {
        objIdToUpdate = _id
      }
    })

    const requestUri = 'http://localhost:3001/api/updateData'
    const requestData = { id: objIdToUpdate, update: { message: updateToAppy } }

    axios.post(requestUri, requestData)
      .then(res => { this.getDataFromDB() })
  }

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;

    return (
      <div>
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={dat.message}>
                  <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                  <span style={{ color: 'gray' }}> data: </span>
                  {dat.message}
                </li>
              ))}
        </ul>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <button onClick={() => this.putDataToDB(this.state.message)}>
            ADD
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

export default App;