import { mount, shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';

import { JitsiMeeting } from '../components';
import { JaaSMeeting } from '../index';
import { IJitsiMeetExternalApi } from '../types';

describe('JaaSMeeting component', () => {

    it('should render correctly', () => {
        const props = {
            roomName: 'TestingJaaSMeetingComponent',
            appId: 'testAppId',
            onApiReady: (externalApi: IJitsiMeetExternalApi) => {
                console.log(externalApi);
            }
        };
        const wrapper = mount(<JaaSMeeting {...props} />);
        const snapshot = toJson(wrapper);


        // Overwrite non-deterministic fields
        snapshot.children[0].children[0].props.id = 'test';
        snapshot.children[0].children[0].props.key = 'test';
        expect(snapshot).toMatchSnapshot();
    });

    it('should pass the correct props to the JitsiMeeting component', () => {
        const props = {
            roomName: 'TestingJaaSMeetingProps',
            appId: 'testAppId',
            onApiReady: (externalApi: IJitsiMeetExternalApi) => {
                console.log(externalApi);
            }
        };
        const wrapper = shallow(<JaaSMeeting {...props} />);

        expect(wrapper.find(JitsiMeeting).prop('roomName')).toBe('testAppId/TestingJaaSMeetingProps');
        expect(wrapper.find(JitsiMeeting).prop('domain')).toBe('8x8.vc');
    });
});
