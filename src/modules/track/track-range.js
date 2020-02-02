import * as React from 'react';
import { Range, getTrackBackground } from 'react-range';

// FROM - https://github.com/tajo/react-range/blob/master/examples/TwoThumbs.tsx

const STEP = 0.5;
const MIN = 0;
const MAX = 100;

class TrackRange extends React.Component {
  state = {
    values: [0, this.props.duration]
  };
  changeTrack = (newTrack) => {
    this.setState({
      values: newTrack
    });
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        <Range
          values={this.state.values}
          step={STEP}
          min={MIN}
          max={this.props.duration}
          onChange={values => {
            this.setState({ values })
          }}
          onFinalChange={this.props.rangeHandler}
          renderTrack={({ props, children }) => (
            <div
              onMouseDown={props.onMouseDown}
              onTouchStart={props.onTouchStart}
              style={{
                ...props.style,
                height: '36px',
                display: 'flex',
                width: '100%'
              }}
            >
              <div
                ref={props.ref}
                style={{
                  height: '5px',
                  width: '100%',
                  borderRadius: '4px',
                  background: getTrackBackground({
                    values: this.state.values,
                    colors: ['#ccc', '#ff0000', '#ccc'],
                    min: MIN,
                    max: this.props.duration
                  }),
                  alignSelf: 'center'
                }}
              >
                {children}
              </div>
            </div>
          )}
          renderThumb={({ props, isDragged }) => (
            <div
              {...props}
              style={{
                ...props.style,
                height: '30px',
                width: '10px',
                borderRadius: 0,
                backgroundColor: '#FFF',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0px 2px 6px #AAA'
              }}
            >
              <div
                style={{
                  height: '16px',
                  width: '4px',
                  backgroundColor: isDragged ? '#ff0000' : '#fff'
                }}
              />
            </div>
          )}
        />
        <output style={{ marginTop: '30px' }} id="output">
          {this.props.displayTime(this.state.values[0].toFixed(1))} - {this.props.displayTime(this.state.values[1].toFixed(1))}
        </output>
      </div>
    );
  }
}

export default TrackRange;