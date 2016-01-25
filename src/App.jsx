import React             from 'react';
import Mozaik            from 'mozaik/browser';
import timeComponents    from 'mozaik-ext-time';
import ftComponents      from 'mozaik-ext-flowthings';

const MozaikComponent = Mozaik.Component.Mozaik;
const ConfigActions   = Mozaik.Actions.Config;

Mozaik.Registry.addExtensions({
    time: timeComponents,
    flowthings: ftComponents
});

React.render(<MozaikComponent/>, document.getElementById('mozaik'));

ConfigActions.loadConfig();
