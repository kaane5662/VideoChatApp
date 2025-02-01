import Head from 'next/head';
import Script from 'next/script';

const cssLoader = `
let head = document.getElementsByTagName('HEAD')[0];
let link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.css';
head.appendChild(link);
`

export default function EmailWidget() {

return (
<>
    <Script id="1" type="" dangerouslySetInnerHTML={{__html: cssLoader}}></Script>

    <Script id="2" src="https://prod-waitlist-widget.s3.us-east-2.amazonaws.com/getwaitlist.min.js"></Script>

    <div id="getWaitlistContainer" data-waitlist_id="24762" data-widget_type="WIDGET_2"></div>

    {/* <h1>This is the main Website</h1> */}
</>
)
}