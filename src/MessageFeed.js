import React from 'react';

const MessageFeed = (props) => {
    return (
        <ul className="MessageFeed">
        {
            props.messages.map((item, index) => <li className={ item.cssClass } key={ index }>{ item.text }</li>)
        }
        </ul>
    )
}

export default MessageFeed;