import { PermissionsAndroid, Platform, Permission } from 'react-native';

export const formatDate = (isoString: string) => {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
};

export const parseQuantityString = (input: string) => {
  return input
    .split("+")
    .map((str) => parseInt(str))
    .filter((num) => !isNaN(num));
};

export const requestAudioPermissions = async () => {
  if (Platform.OS !== 'android') return true;

  try {
    const androidVersion = Platform.Version;
    
    const permissions: Permission[] = [
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ];

    if (androidVersion >= 33) {
      permissions.push(PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO);
    }

    const granted = await PermissionsAndroid.requestMultiple(permissions);

    return (
      granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED &&
      (androidVersion < 33 || granted[PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO] === PermissionsAndroid.RESULTS.GRANTED)
    );
  } catch (err) {
    console.warn('Permission error:', err);
    return false;
  }
};

