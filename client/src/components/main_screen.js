import React, { Component } from 'react';
import axios from 'axios';
import Geocode from 'react-geocode';
import Script from 'react-load-script';
// import DisplayContent from './display_content';
import DisplayScreen from './display_screen';
import Autocomplete from 'react-google-autocomplete';
import 'bootstrap/dist/css/bootstrap.css';
import './main_screen.css';
const API_KEY = 'AIzaSyALb4eynR_OL39AuK731m6pB1toiTAP0Xg';
// const API_KEY = 'AIzaSyA5l6I42KwsLL1W_rAHxjTMPdpVDDdy9RE';
const google = window.google;


class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: '',
      long: '',
      city: '',
      query: '',
      place_val: '',
      category_val: '',
      location_setted: '',
      prevToken: '',
      nextToken: '',
      loading: true,
      page: 1,
      dist: [],
      result: [],
      result1: [],
      result2: [],
      result3: [],
      buttons: [],
      types: [],
      main_result: [],
      search_clicked: false,
      sort_asc: false,
      sort_desc: false,
      sort_rel: true,
      distance_calculated: false
    };
    this.handleScriptLoad = this.handleScriptLoad.bind(this);
    this.handlePlaceSelect = this.handlePlaceSelect.bind(this);
  }

  calculateDistance = async () => {
    var destinations = [];
    // if(this.state.result)
    this.state.result.map(item => {
      let temp = item.geometry.location.lat + ',' + item.geometry.location.lng;

      destinations = [temp, ...destinations];
    });
    destinations = destinations.join('|');
    destinations = encodeURIComponent(destinations);
    console.log('Destinations : ', destinations);
    var ori = this.state.lat + ',' + this.state.long;
    console.log('Origin : ', ori);
    var res2 = await axios.get(
      `/getdistance?origin=${ori}&dest=${destinations}`
    );
    console.log('Response 2 : ', res2);
    var distance = [];
    if (res2 && res2.data && res2.data.rows && res2.data.rows.length !== 0) {
      res2.data.rows[0].elements.map(item => {
        distance = [item.distance.text, ...distance];
        // console.log('Distance : ', item.ditance)
      });
      this.setState({ dist: distance });
      this.state.result.forEach((element, i) => {
        element.dist = distance[i];
      });
      // console.log('Distance : ', distance);
      console.log('Result at end of Calculate Distance : ', this.state.result);
      this.setState({distance_calculated: true});
    }
  };

  getPosition = options => {
    return new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    });
  };

  findLocation = () => {
    const check = window.navigator && window.navigator.geolocation;
    if (check) {
      this.getPosition()
        .then(position => {
          this.setState({
            lat: position.coords.latitude,
            long: position.coords.longitude
          });
          console.log(position);
        })
        .catch(err => {
          alert(
            'You have denied to provide access to your location, you can grant access from site settings '
          );
        });
    } else {
      console.log('Sorry your browser does not support Geolocation ');
    }
  };

  componentDidMount() {
    this.findLocation();
  }

  handleSetCurrentLocationClick = async () => {
    console.log(`Latitude : ${this.state.lat}, Longitude : ${this.state.long}`);
    Geocode.setApiKey(`${API_KEY}`);
    Geocode.enableDebug();
    Geocode.fromLatLng(this.state.lat, this.state.long).then(
      response => {
        const address = response.results[0].formatted_address;
        this.setState({
          place_val: address,
          location_setted: address,
          main_result: [],
          result: [], 
          result1: [],
          result2: [],
          result3: [],
          page: 1
        });
        console.log(address);
      },
      error => {
        console.error(error);
      }
    );
    // var res = axios.get(`/getcurradd?lat=${this.state.lat}&long=${this.state.long}`);
    // console.log('Response of Get Current Address : ', res);
  };

  handleSetLocationClick = async () => {
    const place = this.state.place_val;
    if (place !== '') {
      this.setState({ location_setted: place });
    } else {
      this.handleSetCurrentLocationClick();
    }
    this.setState({
      main_result: [],
      result: [],
      result1: [],
      result2: [],
      result3: [],
      page: 1
    });
    console.log(
      'handleSetLocationClick Location Setted : ',
      this.state.location_setted
    );
  };

  handleCategoryClick = async () => {
    // e.preventDefault();
    console.log('Place Value : ', this.state.place_val);
    if (this.state.place_val.length === 0) {
      this.handleSetCurrentLocationClick();
    }
    console.log('Location Setted : ', this.state.location_setted);
    if (this.state.place_val !== this.state.location_setted) {
      this.handleSetLocationClick();
    }
    var place = this.state.location_setted;
    place = encodeURIComponent(place);
    console.log('Place to be Searched : ', place);
    var res1 = await axios.get(`/getlocation?search=${place}`);
    console.log('Response 1 : ', res1);
    if (
      res1 &&
      res1.data &&
      res1.data.candidates[0] &&
      res1.data.candidates[0].geometry &&
      res1.data.candidates[0].geometry.location
    ) {
      this.setState({
        lat: res1.data.candidates[0].geometry.location.lat,
        long: res1.data.candidates[0].geometry.location.lng
      });
    }

    const category = this.state.category_val;
    console.log('Cateogory being Searched : ', category);
    if (category !== '') {
      console.log(
        'Lat and Long on Category Click : ',
        this.state.lat,
        this.state.long,
        category
      );
      let res2 = await axios.get(
        `/placesearch?lat=${this.state.lat}&long=${
          this.state.long
        }&cat=${category}`
      );
      console.log('Category Click Response 2 : ', res2);
      this.setState({
        main_result: res2.data.results,
        result: res2.data.results,
        result1: res2.data.results,
        nextToken: res2.data.next_page_token,
        types: [],
        buttons: []
      });
    } else {
      console.log(
        'Lat and Long on Category Click : ',
        this.state.lat,
        this.state.long
      );

      let res2 = await axios.get(
        `/search?lat=${this.state.lat}&long=${this.state.long}`
      );
      console.log('Category Click Response 2 with NULL category : ', res2);
      this.setState({
        main_result: res2.data.results,
        result: res2.data.results,
        result1: res2.data.results,
        nextToken: res2.data.next_page_token
      });
    }
    this.calculateDistance();
    this.setState({ search_clicked: true });
    this.buttonTypes();
  };

  buttonTypes = () => {
    var displayButtons;
    if (this.state.search_clicked === true) {
      this.state.main_result.map(item => {
        if (item && item.types && item.types.length !== 0) {
          item.types.map(type => {
            if (this.state.types.includes(type) === false) {
              this.setState({ types: [type, ...this.state.types] });
            }
          });
        }
      });
      console.log('Types of Buttons : ', this.state.types);
      displayButtons = this.state.types.map((type, i) => {
        return (
          <p
            className='w3-bar-item w3-button'
            key={i}
            onClick={() => this.handleButtonClick(type)}
          >
            {type}
          </p>
        );
      });
      this.setState({ buttons: displayButtons });
    }
  };

  handlePrevClick = () => {
    console.log('Prev Click');
    // let page = this.state.page;
    if (this.state.page > 1) {
      if (this.state.page === 2) {
        this.setState({
          result: this.state.result1,
          main_result: this.state.result1
        });
      } else if (this.state.page === 3) {
        this.setState({
          result: this.state.result2,
          main_result: this.state.result2
        });
      }
      const newPage = this.state.page - 1;
      this.setState({ page: newPage });
      this.buttonTypes();
    } else if (this.state.page === 1) {
      this.setState({
        result: this.state.result1,
        main_result: this.state.result1
      });
    }
    // this.calculateDistance();
    console.log('Page : ', this.state.page);
    console.log('Result : ', this.state.result);
  };

  handleNextClick = async () => {
    console.log('Next Click');
    console.log('Next Token Value : ', this.state.nextToken);
    // let page = this.state.page;
    console.log('In beginning Page value : ', this.state.page);
    var flag=0;
    if (this.state.page < 3) {
      if (this.state.page === 1) {
        if (this.state.result2 && this.state.result2.length === 0) {
          console.log('Entered where Result 2 Length is Zero');
          // var url = `/getnextpage?lat=${this.state.lat}&long=${
          //     this.state.long
          //   }&nextToken=${this.state.nextToken}`;
          //   url = encodeURIComponent(url);
          var res = await axios.get(
            `/getnextpage?lat=${this.state.lat}&long=${
              this.state.long
            }&nextToken=${this.state.nextToken}`
          );
          console.log('Response obtained for Next Page : ', res);
          this.setState({
            result: res.data.results,
            main_result: res.data.results,
            result2: res.data.results,
            nextToken: res.data.next_page_token
          });
          if (this.state.result.length !== 0) {
            this.calculateDistance();
            flag=1;
          }
          else
          {
            flag=0;
          }
        } else {
          this.setState({
            result: this.state.result2,
            main_result: this.state.result2
          });
        }
      } else if (this.state.page === 2) {
        if (this.state.result3 && this.state.result3.length === 0) {
          res = await axios.get(
            `/getnextpage?lat=${this.state.lat}&long=${
              this.state.long
            }&nextToken=${this.state.nextToken}`
          );
          this.setState({
            result: res.data.results,
            main_result: res.data.results,
            result3: res.data.results,
            nextToken: res.data.next_page_token
          });
          if (this.state.result.length !== 0) {
            this.calculateDistance();
            flag=1;
          }
          else {
            flag=0;
          }
        } else {
          this.setState({
            result: this.state.result3,
            main_result: this.state.result3
          });
        }
      }
      if(flag===1) {
        this.setState({ page: this.state.page + 1 });
        this.buttonTypes();
      }
    } else if (this.state.page === 3) {
      this.setState({
        result: this.state.result3,
        main_result: this.state.result3
      });
    }
    // this.calculateDistance();
    console.log('At Last Page value : ', this.state.page);
    console.log('Result After Next Click : ', this.state.result);
  };

  handleButtonClick = name => {
    console.log('Clicked Button : ', name);
    var res = [];
    this.setState({ result: [] });
    console.log('Main Result Before Clear Array : ', this.state.main_result);
    console.log('Length of result : ', this.state.result.length);
    console.log('Main Result : ', this.state.main_result);
    this.state.main_result.map(item => {
      if (item.types.includes(name) === true) {
        res = [item, ...res];
        console.log('Item Types : ', item.types);
      }
    });
    console.log('The Response After Button Click : ', res);
    // this.setState({ result: res }, () => {console.log('Result after Button Click : ', this.state.result)});
    // console.log('Result after Button Click : ', this.state.result);
    // console.log('Result after Button Click : ', this.state.result);
    setStateSynchronous(res)
      .then(res => setStateSynchronous(res))
      .then(response => {
        this.setState({ result: response });
        console.log('Result after Button Click : ', this.state.result);
        if (this.state.sort_asc === true) {
          this.handleAscClick();
        } else if (this.state.sort_desc === true) {
          this.handleDescClick();
        }
        return true;
      });

    console.log('Result after the sort checked : ', this.state.result);
  };

  handleRelavance = () => {
    this.setState({ sort_asc: false, sort_desc: false, sort_rel: true });
    this.setState({ result: this.state.main_result });
  };

  handleAscClick = () => {
    this.setState({ sort_asc: true, sort_desc: false, sort_rel: false });
    this.state.result.sort((a, b) => {
      let a_dist = a.dist.split(' ');
      let b_dist = b.dist.split(' ');
      let a_temp = parseFloat(a_dist[0]),
        b_temp = parseFloat(b_dist[0]);
      if (a_dist[1] === 'km') {
        a_temp = parseFloat(a_dist[0]);
        a_temp = a_temp * 1000;
      }
      if (b_dist[1] === 'km') {
        b_temp = parseFloat(b_dist[0]);
        b_temp = b_temp * 1000;
      }
      return a_temp > b_temp ? 1 : -1;
    });

    console.log('After Sort Result : ', this.state.result);
    this.setState({ result: this.state.result });
  };

  handleDescClick = () => {
    this.setState({ sort_asc: false, sort_desc: true, sort_rel: false });
    this.state.result.sort((a, b) => {
      let a_dist = a.dist.split(' ');
      let b_dist = b.dist.split(' ');
      let a_temp = parseFloat(a_dist[0]),
        b_temp = parseFloat(b_dist[0]);
      if (a_dist[1] === 'km') {
        a_temp = parseFloat(a_dist[0]);
        a_temp = a_temp * 1000;
      }
      if (b_dist[1] === 'km') {
        b_temp = parseFloat(b_dist[0]);
        b_temp = b_temp * 1000;
      }
      return a_temp < b_temp ? 1 : -1;
    });

    console.log('After Sort Result : ', this.state.result);
    this.setState({ result: this.state.result });
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSetPlaceSelectClick = (place) => {
    // const place = this.state.place_val;
    this.setState({ location_setted: place });
    this.setState({
      main_result: [],
      result: [],
      result1: [],
      result2: [],
      result3: [],
      page: 1
    });
    console.log(
      'handleSetPlaceSelectClick Location Setted : ',
      this.state.location_setted
    );
  };

  // handleSelect = place => {
  //   if(place && place.name)
  //   {
  //     this.setState({place_val: place.name});
  //     // setStateSynchronous(place)
  //     // .then(place => setStateSynchronous(place))
  //     // .then(place => {
  //     //   this.setState({ result: place.name });
  //     //   // console.log('Place Value after handleSelect : ', this.state.place_val);
  //     //   return true;
  //     // });

  //   }
  //   console.log('Location Setted to : ', this.state.place_val);
  //   this.handleSetLocationClick();
  // }

  handleScriptLoad() {
    // Declare Options For Autocomplete
    var options = {
      types: ['(cities)']
    }; // To disable any eslint 'google not defined' errors

    // Initialize Google Autocomplete
    /*global google*/ this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      options
    );

    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed', this.handlePlaceSelect);
  }

  handlePlaceSelect() {
    // Extract City From Address Object
    let addressObject = this.autocomplete.getPlace();
    let address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      this.setState({
        city: address[0].long_name,
        query: addressObject.formatted_address,
        place_val: addressObject.formatted_address
      });
    }
  }

  handlePlaceSelectChange = e => {
    this.setState({ place_val: e.target.value });
  };

  render() {
    return (
    <div>
          <section class="slider d-flex align-items-center">
            <div class="container">
                <div class="row d-flex justify-content-center">
                    <div class="col-md-12">
                        <div class="slider-title_box">
                            <div class="row">
                                <div class="col-md-12">
                                    <div class="slider-content_wrap">
                                        <h1>Discover great places over the World</h1>
                                        <h5>Let's uncover the best places to eat, drink, and shop nearest to you.</h5>
                                    </div>
                                </div>
                            </div>
                            <div class="row d-flex justify-content-center">
                                <div class="col-md-10">
                                    <form class="form-wrap mt-4">
                                        <div class="btn-group" role="group" aria-label="Basic example">
                                        
                                            {/* <input type="text" placeholder="What are your looking for?" class="btn-group1" id='autocomplete' onFocus="geolocate()"/> */}
                                            <button type='button' className='btn-form' onClick={this.handleSetCurrentLocationClick} style={{ width: '10%', borderRadius: '5%'}}><span class='icon-location-pin'></span></button>
                                            {/* <Autocomplete
                                                type="text" placeholder="Place you want to look?" class="btn-group1" 
                                                onPlaceSelected={place => {
                                                    console.log(place);
                                                    this.handleSelect(place)
                                                }}
                                                types={['(regions)']}
                                                // name='place_val'
                                                // value={this.state.place_val}
                                                // onChange={this.handleChange}
                                                /> */}
                                            <Script
                                              url='https://maps.googleapis.com/maps/api/js?key=AIzaSyALb4eynR_OL39AuK731m6pB1toiTAP0Xg&libraries=places'
                                              onLoad={this.handleScriptLoad}
                                            />
                                            <input
                                              id='autocomplete'
                                              placeholder='Place you want to look?'
                                              type='text'
                                              hintText='Search City'
                                              class="btn-group1"
                                              value={this.state.place_val}
                                              onChange={this.handlePlaceSelectChange}                                    
                                            />
                                            <input type="text" name='category_val' placeholder="What are your looking for?" class="btn-group2" onChange={this.handleChange} value={this.state.category_val} />
                                            <button type="button" className="btn-form" onClick={this.handleCategoryClick}><span class="icon-magnifier search-icon"></span>SEARCH<i class="pe-7s-angle-right"></i></button>
                                        </div>
                                    </form>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>            
        </section>
            
        
          {(this.state.search_clicked) ? (
            <div>
            <section class='main-block light-bg'>
              <div class="container">
                <div class="row justify-content-center">
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      marginBottom: '3rem'
                    }}
                  >
                    <span style={{ marginRight: '2rem' }}>
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={this.handlePrevClick}
                      >
                        Prev
                      </button>
                    </span>
                    <span style={{ marginLeft: '2rem', marginRight: '2rem' }}>
                      <button
                        type='button'
                        className='btn btn-primary'
                        onClick={this.handleNextClick}
                      >
                        Next
                      </button>
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className='w3-container' style={{ marginRight: '2rem' }}>
                      <div className='w3-dropdown-hover'>
                        <button className='w3-button w3-black'>Sort By</button>
                        <div className='w3-dropdown-content w3-bar-block w3-border'>
                          <p
                            className='w3-bar-item w3-button'
                            onClick={this.handleRelavance}
                          >
                            Sort By Relevance
                          </p>
                          <p
                            className='w3-bar-item w3-button'
                            onClick={this.handleAscClick}
                          >
                            Sort in Ascending Order
                          </p>
                          <p
                            className='w3-bar-item w3-button'
                            onClick={this.handleDescClick}
                          >
                            Sort in Descending Order
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='w3-container' style={{ marginLeft: '2rem' }}>
                      <div className='w3-dropdown-hover'>
                        <button className='w3-button w3-black'>Categories</button>
                        <div className='w3-dropdown-content w3-bar-block w3-border'>
                          {this.state.buttons}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  </div>
                  </div>
            </section>
                  {(this.state.distance_calculated) ? (<DisplayScreen SearchList={this.state.result} /> ) : (<div />)}
                  </div>
                
              ) : (
                <div />
              )}
            
            </div>
          ) ;
  }
}

function setStateSynchronous(res) {
  return new Promise(resolve => {
    resolve(res);
  });
}

export default MainScreen;
