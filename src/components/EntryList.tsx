import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {SwipeListView} from 'react-native-swipe-list-view';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {getPersons} from '../services/api';
import {formatDate} from '../utils/helper';
import {useAuth} from '../contexts/AuthProvider';
import {RootStackParamList} from '../types/navigation';
import AddMoreScreen from './AddMoreScreen';
import DeleteConfirmationModal from './DeleteConformation';
import {Animated, Easing, FlatList} from 'react-native';

type selectedItemType = {
  id: string;
  created_at: string;
  modified_at: string;
  name: string;
  quantity: number;
  unit: string;
  item: string;
};

export default function EntryList() {
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<selectedItemType>({} as any);
  const [persons, setPersons] = useState<any[]>([]);
  const [tempPersons, setTempPersons] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isDelete, setIsDelete] = useState(false);

  // const scrollY = new Animated.Value(0);
  const scrollY = useRef(new Animated.Value(0)).current;

  const {token} = useAuth();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const fetchPersons = async () => {
    setLoading(true);
    const persons = await getPersons(token);
    setPersons(persons || []);
    setTempPersons(persons || []);
    setLoading(false);
  };

  const handlePress = (item: any) => {
    navigation.navigate('Detail', {
      id: item.id.toString(),
      name: item.name,
    });
  };

  const handleDelete = (item: any) => {
    setSelectedItem(item);
    setIsDelete(true);
  };

  const handleAddMoreClick = (item: any) => {
    setSelectedItem(item);
    setShowDialog(true);
  };

  const handleAddClick = () => {
    navigation.navigate('AddEntry');
  };

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filteredPersons = tempPersons.filter(person =>
      person.name.toLowerCase().includes(text.toLowerCase()),
    );
    setPersons(filteredPersons);
  };

  const onDeleteClose = (isDeleted: boolean) => {
    setIsDelete(false);
    if (isDeleted) {
      setPersons(prev => prev.filter(item => item.id !== selectedItem.id));
    }
  };

  const onAddMoreClose = (isAdded = false, total_quantity = 0) => {
    setShowDialog(false);
    if (isAdded) {
      setPersons(prev =>
        prev.map(item =>
          item.id === selectedItem.id
            ? {...item, total_quantity: total_quantity}
            : item,
        ),
      );
    }
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return (
    <Animated.ScrollView
      onScroll={Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
        useNativeDriver: true,
      })}
      scrollEventThrottle={50}
      showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.summaryCard,
            {
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 50],
                    outputRange: [0, -100],
                    extrapolate: 'clamp',
                  }),
                },
              ],
              opacity: scrollY.interpolate({
                inputRange: [0, 50],
                outputRange: [1, 0],
                extrapolate: 'clamp',
              }),
            },
          ]}>
          <Text style={styles.cardTitle}>Total Weight</Text>
          <Text style={styles.cardValue}>
            {persons.reduce((sum, item) => sum + item.total_quantity, 0)} kg
          </Text>
        </Animated.View>

        <View style={styles.searchContainer}>
          <Ionicons
            name="menu"
            size={24}
            color="#6200EE"
            style={styles.menuIcon}
          />
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={handleSearch}
          />
          {searchText !== '' && (
            <Ionicons
              name="close-circle"
              size={24}
              color="#6200EE"
              onPress={() => handleSearch('')}
            />
          )}
        </View>

        {loading && <ActivityIndicator size="large" color="#0000ff" />}

        <SwipeListView
          scrollEnabled={false} // prevent double scroll issue
          data={persons}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <Pressable
              onPress={() => handlePress(item)}
              style={({pressed}) => [
                styles.transcriptionItem,
                {
                  backgroundColor: pressed ? '#d1c4e9' : '#EDE7F6',
                },
              ]}>
              <View>
                <Text style={styles.transcriptionText}>{item.name}</Text>
                <Text style={styles.timeText}>
                  {formatDate(item.created_at)}
                </Text>
              </View>
              <Text style={styles.transcriptionText}>
                {item.total_quantity} {item.unit}
              </Text>
            </Pressable>
          )}
          renderHiddenItem={({item}) => (
            <View style={styles.hiddenRow}>
              <TouchableOpacity
                style={[styles.actionButton, {backgroundColor: '#FFA000'}]}
                onPress={() => handleAddMoreClick(item)}>
                <MaterialIcons name="add" size={28} color="white" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, {backgroundColor: '#D32F2F'}]}
                onPress={() => handleDelete(item)}>
                <MaterialIcons name="delete" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-165}
          disableRightSwipe
          closeOnRowPress={true}
        />
        <AddMoreScreen
          visible={showDialog}
          onClose={onAddMoreClose}
          selectedItem={selectedItem}
        />
        {isDelete && (
          <DeleteConfirmationModal
            visible={isDelete}
            onClose={onDeleteClose}
            selectedItem={selectedItem}
          />
        )}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE7F6',
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 30,
    marginBottom: 15,
  },
  menuIcon: {marginRight: 10},
  searchInput: {flex: 1, fontSize: 16, color: '#333'},
  transcriptionItem: {
    backgroundColor: '#EDE7F6',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 75,
    marginBottom: 10,
  },
  transcriptionText: {fontWeight: 'bold', color: '#333', fontSize: 18},
  timeText: {color: 'gray', fontSize: 14},
  micButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#6200EE',
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  hiddenRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 75,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  actionButton: {
    height: '100%',
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginLeft: 5,
  },
  summaryCard: {
    backgroundColor: '#6200EE',
    padding: 20,
    borderRadius: 20,
    marginBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  cardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
});

// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   Pressable,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {SwipeListView} from 'react-native-swipe-list-view';
// import {useNavigation} from '@react-navigation/native';
// import {NativeStackNavigationProp} from '@react-navigation/native-stack';
// import {getPersons} from '../services/api';
// import {formatDate} from '../utils/helper';
// import {useAuth} from '../contexts/AuthProvider';
// import {RootStackParamList} from '../types/navigation';
// import AddMoreScreen from './AddMoreScreen';
// import DeleteConfirmationModal from './DeleteConformation';

// type selectedItemType = {
//   id: string;
//   created_at: string;
//   modified_at: string;
//   name: string;
//   quantity: number;
//   unit: string;
//   item: string;
// };

// export default function EntryList() {
//   const [loading, setLoading] = useState(false);
//   const [showDialog, setShowDialog] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<selectedItemType>({} as any);
//   const [persons, setPersons] = useState<any[]>([]);
//   const [tempPersons, setTempPersons] = useState<any[]>([]);
//   const [searchText, setSearchText] = useState('');
//   const [isDelete, setIsDelete] = useState(false);
//   const {logout, token} = useAuth();

//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   const fetchPersons = async () => {
//     setLoading(true);
//     const persons = await getPersons(token);
//     setPersons(persons || []);
//     setTempPersons(persons || []);
//     setLoading(false);
//   };

//   const handlePress = (item: any) => {
//     navigation.navigate('Detail', {
//       id: item.id.toString(),
//       name: item.name,
//     });
//   };

//   const handleDelete = (item: any) => {
//     setSelectedItem(item);
//     setIsDelete(true);
//   };

//   const handleAddMoreClick = (item: any) => {
//     setSelectedItem(item);
//     setShowDialog(true);
//   };

//   const handleAddClick = () => {
//     navigation.navigate('AddEntry');
//   };

//   const handleSearch = (text: string) => {
//     setSearchText(text);
//     const filteredPersons = tempPersons.filter(person =>
//       person.name.toLowerCase().includes(text.toLowerCase()),
//     );
//     setPersons(filteredPersons);
//   };

//   const onDeleteClose = (isDeleted: boolean) => {
//     setIsDelete(false);
//     if (isDeleted) {
//       setPersons(prev => prev.filter(item => item.id !== selectedItem.id));
//     }
//   };

//   const onAddMoreClose = (isAdded = false, total_quantity = 0) => {
//     setShowDialog(false);
//     if (isAdded) {
//       setPersons(prev =>
//         prev.map(item =>
//           item.id === selectedItem.id
//             ? {...item, total_quantity: total_quantity}
//             : item,
//         ),
//       );
//     }
//   };

//   useEffect(() => {
//     fetchPersons();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <Ionicons
//           name="menu"
//           size={24}
//           color="#6200EE"
//           style={styles.menuIcon}
//           onPress={logout}
//         />
//         <TextInput
//           placeholder="Search..."
//           style={styles.searchInput}
//           value={searchText}
//           onChangeText={handleSearch}
//         />
//         {searchText !== '' && (
//           <Ionicons
//             name="close-circle"
//             size={24}
//             color="#6200EE"
//             onPress={() => handleSearch('')}
//           />
//         )}
//       </View>
//       {loading && <ActivityIndicator size="large" color="#0000ff" />}

//       <SwipeListView
//         showsVerticalScrollIndicator={false}
//         data={persons}
//         keyExtractor={item => item.id}
//         renderItem={({item}) => (
//           <Pressable
//             onPress={() => handlePress(item)}
//             style={({pressed}) => [
//               styles.transcriptionItem,
//               {
//                 backgroundColor: pressed ? '#d1c4e9' : '#EDE7F6',
//               },
//             ]}>
//             <View>
//               <Text style={styles.transcriptionText}>{item.name}</Text>
//               <Text style={styles.timeText}>{formatDate(item.created_at)}</Text>
//             </View>
//             <Text style={styles.transcriptionText}>
//               {item.total_quantity} {item.unit}
//             </Text>
//           </Pressable>
//         )}
//         renderHiddenItem={({item}) => (
//           <View style={styles.hiddenRow}>
//             <TouchableOpacity
//               style={[styles.actionButton, {backgroundColor: '#FFA000'}]}
//               onPress={() => handleAddMoreClick(item)}>
//               <MaterialIcons name="add" size={28} color="white" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.actionButton, {backgroundColor: '#D32F2F'}]}
//               onPress={() => handleDelete(item)}>
//               <MaterialIcons name="delete" size={24} color="white" />
//             </TouchableOpacity>
//           </View>
//         )}
//         rightOpenValue={-165}
//         disableRightSwipe
//         closeOnRowPress={true}
//       />
//       <TouchableOpacity onPress={handleAddClick} style={styles.micButton}>
//         <Ionicons name="add-circle" size={50} color="white" />
//       </TouchableOpacity>

//       <AddMoreScreen
//         visible={showDialog}
//         onClose={onAddMoreClose}
//         selectedItem={selectedItem}
//       />

//       {isDelete && (
//         <DeleteConfirmationModal
//           visible={isDelete}
//           onClose={onDeleteClose}
//           selectedItem={selectedItem}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 20,
//     paddingTop: 20,
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#EDE7F6',
//     paddingVertical: 3,
//     paddingHorizontal: 15,
//     borderRadius: 30,
//     marginBottom: 15,
//   },
//   menuIcon: {marginRight: 10},
//   searchInput: {flex: 1, fontSize: 16, color: '#333'},
//   transcriptionItem: {
//     backgroundColor: '#EDE7F6',
//     padding: 16,
//     borderRadius: 10,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 75,
//     marginBottom: 10,
//   },
//   transcriptionText: {fontWeight: 'bold', color: '#333', fontSize: 18},
//   timeText: {color: 'gray', fontSize: 14},
//   micButton: {
//     position: 'absolute',
//     bottom: 30,
//     alignSelf: 'center',
//     backgroundColor: '#6200EE',
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 5,
//   },
//   hiddenRow: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     height: 75,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     marginBottom: 10,
//     paddingHorizontal: 5,
//   },
//   actionButton: {
//     height: '100%',
//     width: 75,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//     marginLeft: 5,
//   },
// });
