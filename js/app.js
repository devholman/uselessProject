// es5, 6, and 7 polyfills, powered by babel
import polyfill from "babel-polyfill"

//
// fetch method, returns es6 promises
// if you uncomment 'universal-utils' below, you can comment out this line
import fetch from "isomorphic-fetch"

// universal utils: cache, fetch, store, resource, fetcher, router, vdom, etc
// import * as u from 'universal-utils'

// the following line, if uncommented, will enable browserify to push
// a changed fn to you, with source maps (reverse map from compiled
// code line # to source code line #), in realtime via websockets
// -- browserify-hmr having install issues right now
// if (module.hot) {
//     module.hot.accept()
//     module.hot.dispose(() => {
//         app()
//     })
// }

// Check for ServiceWorker support before trying to install it
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./serviceworker.js').then(() => {
//         // Registration was successful
//         console.info('registration success')
//     }).catch(() => {
//         console.error('registration failed')
//             // Registration failed
//     })
// } else {
//     // No ServiceWorker Support
// }

import DOM from 'react-dom'
import React, {Component} from 'react'
import Backbone from 'backbone'
import jquery from 'jquery'

function app() {



	// var AppView = React.createClass({
	// 	render: function(){
	// 		return(
	// 			<div className="page-container">
	// 				<FirstView/>
	// 				<HappyView giffs={this.props.gifs} />
	// 			</div>
	// 		)
	// 	}
	// })
	//**************************************************
	//------------------Backbone Model------------------
	//**************************************************

	var gifColl = Backbone.Collection.extend({
		_apiKey: "dc6zaTOxFJmzC",
		url    : "http://api.giphy.com/v1/gifs/search?",

		parse: function(rawData){
				console.log('fetch successful! parsing,data ')
				console.log(rawData)
				console.log('...and triggering -sync-')
			   return rawData.data
		}			   

	})


	//**************************************************
	//------------------React Views---------------------
	//**************************************************

	var FirstView = React.createClass({
		
		changeView: function(){
			location.hash = "happygifs"
		},

		render: function(){
			return(
				<div className="bad-day-container">
					<p>Having a bad day?</p>
					<button onClick={this.changeView}>Click Here</button>
				</div>
			)
		}
	})

	var HappyView = React.createClass({
		
		// getPicsJSX: function(objArray){

		// }

		getInitialState: function(){
			return {
				visibleGifs: []
			}
		},

		componentDidMount:function(){
			console.log("component mounted")
			console.log(this.props.gifs.models)

			var self = this
			this.props.gifs.on("sync", function() {
				console.log("-sync- event heard!")
				self._lazyLoadGifs( self.props.gifs.models )
			})
		},

		_lazyLoadGifs: function(modArr){
			var self = this
		
			setTimeout(function(){
				console.log("loading a gif!!")

				if( self.state.visibleGifs.length < modArr.length){

					self.state.visibleGifs.push( modArr[self.state.visibleGifs.length] )

					self.setState({
						visibleGifs: self.state.visibleGifs
					})

					self._lazyLoadGifs(modArr)
				} 

			}, 500)

		},

		_getPicsJSX: function(modArr) {
		    var jsxArray = []
		    for (var i = 0; i < modArr.length; i++) {
		    	var imgObj    = modArr[i]
		        var component = <Image key={i} gifData={imgObj} /> 
		        jsxArray.push(component)
		    }
		    return jsxArray
		},

		render: function(){
			console.log("*********Component rendered*********")
			// console.log(this.props)
			// console.log(this.props.gifs)
			// var modArr = this.props.gifs.models
			// var images = this.props.gifs.models[0].attributes.images.original.url

			return(
				<div>
					{this._getPicsJSX(this.state.visibleGifs)}
				</div>
			)
		}
	})

	var Image = React.createClass({
		// console.log("Get ALL THE  IMAGES")
		getInitialState: function(){
			return{
				currentOpacity: .2,
			}
		},

		componentDidMount: function(){
			var self = this
			console.log('component mounted!!!')
			
			setTimeout( function(){
				self.setState({
					currentOpacity: 1
				})
			},10)
			
		},

		render: function(){

			// console.log("GET ALL THE IMAGES")
			var gifDataModel = this.props.gifData
			console.log(this.state.currentOpacity)

			return(
				<img 
					style={ { opacity: this.state.currentOpacity  } }
					className={"imagurr"}
					src={ gifDataModel.attributes.images.original.url } 
				/>
			)
		}
	})



	//**************************************************
	//------------------Backbone Router-----------------
	//**************************************************

	var happyRouter = Backbone.Router.extend({
		
		routes:{
			"home"     : "handleHome",
			"happygifs": "handleGifs",
			"*Default" : "handleHome"
		},

		handleHome: function(){

			DOM.render(<FirstView/>, document.querySelector('.container'))
		},

		handleGifs: function(){
			this.coll = new gifColl()
			this.coll.fetch({
				data: {
					q:"babies",
					api_key: this.coll._apiKey
				}
			})
			DOM.render(<HappyView gifs={this.coll} />, document.querySelector('.container'))
		},

		initialize: function() {
			Backbone.history.start()
		}

		
	})

	var rtr = new happyRouter()
	

}

app()
