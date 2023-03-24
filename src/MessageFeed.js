import React from 'react';
import { TypeAnimation } from 'react-type-animation';

const MessageFeed = (props) => {
    return (
        <ul className="MessageFeed">
        {
            props.messages.map((item, index) =>
                <li className={ item.cssClass } key={ index }>
                    <TypeAnimation
                        sequence={[
                          item.text,
                          () => {
                            console.log('Sequence completed'); // Place optional callbacks anywhere in the array
                          }
                        ]}
                        speed={65}
                        wrapper="span"
                        cursor={true}
                    />
                </li>
            )
        }
        </ul>
    )
}

export default MessageFeed;