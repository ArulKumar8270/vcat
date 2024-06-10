import React from 'react';
// import '../css/Otp.css';

class Otp extends React.Component {
    state = { otp: [] };
    otpTextInput = [];

    componentDidMount() {
        const { autoFocus } = this.props;
        if (autoFocus !== false) {
            this.otpTextInput[0]._root.focus();
        }
    }

    render() {
        const { otpWrapper } = this.props;
        return (
            <div className={"gridPad " + otpWrapper}>{this.renderInputs()}</div>
        );
    }

    renderInputs = () => {
        let number = 6;
        if (this.props && this.props.number)
            number = this.props.number;
        const inputs = Array(number).fill(0);
        const txt = inputs.map((i, j) => (
            <div key={j} className="txtMargin" >
                <input
                    className="inputRadius"
                    type="number"
                    onChange={v => this.focusNext(j, v.target.value)}
                    onKeyDownCapture={e => this.focusPrevious(e.key, j)}
                    ref={ref => (this.otpTextInput[j] = { _root: ref })}
                    onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 1)
                    }}
                    onFocus={() => {
                        this.otpTextInput[j]._root.value = '';
                    }}
                    min="0"
                    autoComplete="off"
                />
            </div>

        ));
        return txt;
    }

    focusPrevious = (key, index) => {
        if (key === 'Backspace' && index !== 0) {
            this.otpTextInput[index - 1]._root.focus();
            this.otpTextInput[index]._root.value = '';
        }
    }

    focusNext = (index, value) => {
        if (index < this.otpTextInput.length - 1 && value) {
            this.otpTextInput[index + 1]._root.focus();
        }
        if (index === this.otpTextInput.length - 1) {
            this.otpTextInput[index]._root.blur();
        }
        const otp = this.state.otp;
        otp[index] = value;
        this.setState({ otp });
        this.props.getOtp(otp.join(''));
    }
}
export default Otp;