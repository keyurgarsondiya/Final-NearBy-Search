import React, { Component } from 'react';
import axios from 'axios';
import './display_screen.css';
const API_KEY = 'AIzaSyA5l6I42KwsLL1W_rAHxjTMPdpVDDdy9RE';

class DisplayScreen extends Component {
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
      formatted_address: 'Loading',
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
    // console.log('List Obtained : ', list);
    const nearPlaces = list.map((place, i) => (
      <div class='col-md-4 featured-responsive list-element' key={i}>
        <div class='featured-place-wrap'>
          <div
            className='list-element'
            data-toggle='modal'
            data-target='#myModal'
            onClick={() => this.handleItemClick(place)}
          >
            <img src={place.icon} alt='No Icon Available' />
            <span class='featured-rating-orange'>{place.rating}</span>
            <div class='featured-title-box'>
              <h6>{place.name}</h6>
              <ul>
                <li>
                  <span class='icon-location-pin' />
                  <p>{place.types[0]}</p>
                </li>
                <li>
                  <i class='fa fa-car' />
                  <p>{place.dist} Away</p>
                </li>
              </ul>
              {place.opening_hours ? (
                place.opening_hours.open_now ? (
                  <div class='bottom-icons'>
                    <div class='open-now'>OPEN NOW</div>
                    <span class='ti-heart' />
                    <span class='ti-bookmark' />
                  </div>
                ) : (
                  <div class='bottom-icons'>
                    <div class='closed-now'>CLOSED NOW</div>
                    <span class='ti-heart' />
                    <span class='ti-bookmark' />
                  </div>
                )
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </div>
    ));
    return (
      <section class='main-block light-bg'>
        <div class='container'>
          <div class='row justify-content-center'>
            <div class='col-md-5'>
              <div class='styled-heading'>
                <h3>Featured Places</h3>
              </div>
            </div>
          </div>
          <div class='row'>{nearPlaces}</div>
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
                  <div className='featured-title-box'>
                    <ul>
                      <li>
                        <span class='icon-user' />
                        <p>Name: {this.state.result.name}</p>
                      </li>
                      <li>
                        <span class='icon-location-pin' />
                        <p>Address: {this.state.result.formatted_address} </p>
                      </li>
                      <li>
                        <span class='icon-screen-smartphone' />
                        <p>
                          International Phone Number:&nbsp;
                          {this.state.result.international_phone_number}
                        </p>
                      </li>
                      <li>
                        <span class='icon-link' />
                        <p>
                          Website:&nbsp;
                          <a href={this.state.result.website} target='_blank'>
                            {this.state.result.name} Website
                          </a>
                        </p>
                      </li>
                    </ul>
                    {/* <p>
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
                  </p> */}
                  </div>
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
      </section>
    );
  }
}

export default DisplayScreen;
