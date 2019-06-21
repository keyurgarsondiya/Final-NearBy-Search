import React, { Component } from 'react';
import './display_content.css';
import axios from 'axios';

class DisplayContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {
        name: '',
        add: '',
        international_phone_number: '',
        rating: '',
        website: ''
      },
      loading: true
    };
  }

  handleItemClick = async place => {
    const place_id = place.place_id;
    const res1 = {
      name: 'Loading',
      add: 'Loading',
      international_phone_number: 'Loading',
      rating: 'Loading',
      website: 'Loading'
    };
    const res = await axios.get(`/placedetail?id=${place_id}`);
    // console.log(res);

    res.data.status === 'OVER_QUERY_LIMIT'
      ? this.setState({ loading: true })
      : this.setState({ loading: false });
    this.state.loading === true
      ? this.setState({ result: res1 })
      : this.setState({
          result: res.data.result
        });

    console.log('Result : ', this.state.result);
  };

  render() {
    var list = this.props.SearchList;
    // console.log('List : ', list);
    const nearPlace = list.map((place, i) => {
      return (
        <div className='list' key={i}>
          <div
            className='list-element'
            data-toggle='modal'
            data-target='#myModal'
            onClick={() => this.handleItemClick(place)}
          >
            <div>
              <img src={place.icon} alt='No icon available' />
              <span>{place.name}</span>
              <span className='distance'>
                <span>
                  <button type='button' className='btn btn-secondary'>
                    <i className='fa fa-road' />
                  </button>
                </span>
                <span className='distance-text'>{place.dist}</span>
              </span>
            </div>
          </div>
        </div>
      );
    });
    return (
      <div>
        <div>{nearPlace}</div>
        <div className='modal fade' id='myModal' role='dialog'>
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h4 className='modal-title'>{this.state.result.name}</h4>
                <button type='button' className='close' data-dismiss='modal'>
                  &times;
                </button>
              </div>
              <div className='modal-body'>
                <p>
                  Name: {this.state.result.name}
                  <br />
                  International Phone Number:&nbsp;
                  {this.state.result.international_phone_number}
                  <br />
                  Address: {this.state.result.formatted_address}
                  <br />
                  Rating: {this.state.result.rating}
                  <br />
                  Website:&nbsp;
                  <a href={this.state.result.website} target='_blank'>
                    {this.state.result.name} Website
                  </a>
                  <br />
                </p>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-default'
                  data-dismiss='modal'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default DisplayContent;
