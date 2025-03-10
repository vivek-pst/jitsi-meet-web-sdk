import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchExternalApi } from '..';
import { IJitsiMeetExternalApi, IJitsiMeetingProps, JitsiMeetExternalApi } from '../types';
import { generateComponentId } from '../utils';

/**
 * Returns the JitsiMeeting Component with access to a custom External API
 * to be used as-it-is in React projects
 *
 * @param {IJitsiMeetingProps} props the component's props
 * @returns {React.Component} the `JitsiMeeting` Component
 * @example
  ```js
    <JitsiMeeting
        domain='meet.jit.si'
        roomName: 'TestingJitsiMeetingComponent'
        spinner={CustomSpinner}
        onApiReady={(externalApi) => console.log(externalApi)}
    />
  ```
 */
const JitsiMeeting = ({
    domain,
    roomName,
    configOverwrite,
    interfaceConfigOverwrite,
    jwt,
    invitees,
    devices,
    userInfo,
    spinner: Spinner,
    onApiReady,
    getIFrameRef
}: IJitsiMeetingProps) => {
    const [ componentId, setComponentId ] = useState<string>('');
    const [ loading, setLoading ] = useState(true);
    const [ apiLoaded, setApiLoaded ] = useState(false);
    const externalApi = useRef<JitsiMeetExternalApi>();
    const apiRef = useRef<IJitsiMeetExternalApi>();
    const meetingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setComponentId(generateComponentId('jitsiMeeting'));
        fetchExternalApi(domain)
            .then((api: JitsiMeetExternalApi) => {
                externalApi.current = api;
                setApiLoaded(true);
            })
            .catch((e: Error) => console.error(e.message));
    }, []);

    const loadIFrame = useCallback((JitsiMeetExternalAPI: JitsiMeetExternalApi) => {
        apiRef.current = new JitsiMeetExternalAPI(domain, {
            roomName,
            configOverwrite,
            interfaceConfigOverwrite,
            jwt,
            invitees,
            devices,
            userInfo,
            parentNode: meetingRef.current
        });
        setLoading(false);
        if (apiRef.current) {
            onApiReady(apiRef.current);
            (getIFrameRef && meetingRef.current) && getIFrameRef(meetingRef.current);
        }
    }, [
        apiRef,
        meetingRef,
        onApiReady,
        getIFrameRef,
        domain,
        roomName,
        configOverwrite,
        interfaceConfigOverwrite,
        jwt,
        invitees,
        devices,
        userInfo
    ]);

    useEffect(() => {
        if (apiLoaded && !apiRef.current) {
            if (externalApi.current) {
                loadIFrame(externalApi.current);
            }
        }
    }, [ apiLoaded, loadIFrame ]);

    const renderLoadingSpinner = useCallback(() => {
        if (!Spinner) {
            return null;
        }
        if (!loading || apiRef.current) {
            return null;
        }

        return <Spinner />;
    }, [ Spinner, apiRef.current ]);

    return (
        <>
            {renderLoadingSpinner()}
            <div
                id={componentId}
                key={componentId}
                ref={meetingRef}
            />
        </>
    );
};

export default JitsiMeeting;
