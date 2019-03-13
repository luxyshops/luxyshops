import React, { PureComponent } from 'react'
import Svg, {Defs, Path, G, Mask, Use, Rect} from 'react-native-svg';

class Heart extends PureComponent {
  render() {
    return (
      <Svg width="24px" height="23px" viewBox="0 0 24 23" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <Defs>
          <Path d="M24,8.8116126 C24,10.6590148 23.281944,12.4307044 22.0040597,13.7365305 L13.4816633,22.4493653 C12.6632085,23.286109 11.336231,23.286109 10.5177762,22.4493653 L1.99537972,13.7365305 C-0.665126601,11.0165734 -0.665126569,6.60665176 1.99537979,3.88669472 C4.65588615,1.16673767 8.96941922,1.16673764 11.6299256,3.88669466 L11.9997197,4.26475205 L12.3693399,3.88687248 C13.6467983,2.5802553 15.3797637,1.84615385 17.1867868,1.84615385 C18.9937279,1.84615385 20.726618,2.58018869 22.0040597,3.88669464 C23.2820091,5.1926816 24,6.96429424 24,8.8116126 Z" id="path-1" />
        </Defs>
        <G id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <G id="Icons/Heart" transform="translate(0.000000, -1.000000)">
            <Mask id="mask-2" fill="white">
              <Use href="#path-1" />
            </Mask>
            <Use id="Shape" fill="#C5CCD6" fillRule="nonzero" href="#path-1" />
            <G id="Colors/Bright-pink-Copy" mask="url(#mask-2)" fillRule="evenodd">
              <Rect id="Color" fill="#FF3B30" x="0" y="0" width="24" height="24" />
              <Rect id="Color-Copy" fill="#7CC797" x="0" y="0" width="24" height="24" />
            </G>
          </G>
        </G>
      </Svg>

    )
  }
}

export default {Heart};
