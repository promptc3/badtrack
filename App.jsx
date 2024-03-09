/* eslint-disable react-native/no-inline-styles */

import React, {useMemo, useRef, useState} from 'react';
import {
  Alert,
  Appearance,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useSharedValue} from 'react-native-reanimated';
import Slider from '@react-native-community/slider';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {
  saveHabit,
  logHabit,
  allHabits,
  deleteHabit,
  updateHabit,
} from './model/helper';
import {withObservables} from '@nozbe/watermelondb/react';

import EmojiPicker from 'rn-emoji-keyboard';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const Stack = createNativeStackNavigator();

function ButtonGroup({buttons, selectedIndex, onPress}) {
  const getBtnBorderRadius = index => {
    if (index > 0 && index === buttons.length - 1) {
      return {borderBottomRightRadius: 10, borderTopRightRadius: 10};
    } else if (index === 0) {
      return {borderBottomLeftRadius: 10, borderTopLeftRadius: 10};
    } else {
      return {borderRadius: 0};
    }
  };

  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const getBtnBackground = index => {
    if (activeIndex && index === activeIndex) {
      return {backgroundColor: 'lightblue'};
    } else {
      return {backgroundColor: 'white'};
    }
  };

  const handleSelect = (value, index) => {
    if (value) {
      setActiveIndex(index);
      onPress(value, index);
    } else {
      onPress();
    }
  };

  const flexBasisSize = `${99 / buttons.length}%`;
  const btnList = useMemo(() => {
    return buttons;
  }, [buttons]);

  return (
    <View
      style={{flexDirection: 'row', flexWrap: 'nowrap', gap: 2, margin: 10}}>
      {btnList.map((b, i) => {
        const btnBorderRadius = getBtnBorderRadius(i);
        const btnBg = getBtnBackground(i);
        return (
          <Pressable
            key={b}
            style={[
              btnBorderRadius,
              btnBg,
              {padding: 10, flexBasis: flexBasisSize},
            ]}
            onPress={() => handleSelect(b, i)}>
            <Text style={{color: blackcolors[7].hex, alignSelf: 'center'}}>
              {b}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const AppButton = ({title, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? blackcolors[4].hex : blackcolors[3].hex,
  };
  return (
    <Pressable
      onPress={onPress}
      style={[styles.appButtonContainer, backgroundStyle]}>
      <Text style={styles.appButtonText}>{title}</Text>
    </Pressable>
  );
};

function Section({children, title, onPress}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={[
        styles.sectionContainer,
        {
          backgroundColor: isDarkMode ? blackcolors[7].hex : blackcolors[1].hex,
        },
      ]}>
      <Pressable onPress={onPress}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? blackcolors[7].hex : blackcolors[8].hex,
            },
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? blackcolors[0].hex : blackcolors[7].hex,
            },
          ]}>
          {children}
        </Text>
      </Pressable>
    </View>
  );
}

const Card = ({title, icon, subtitle, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  // const renderIcon = icon.substring(0, 1);
  return (
    <Pressable onPress={onPress}>
      <View
        style={{
          backgroundColor: isDarkMode ? blackcolors[6].hex : 'white',
          borderRadius: 10,
          width: 200,
          maxWidth: '100%',
          height: 150,
          maxHeight: '100%',
          flexBasis: 100,
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 8,
        }}>
        <Text
          style={{
            fontSize: 32,
            alignSelf: 'center',
            height: 70,
          }}>
          {icon}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 18,
            fontWeight: 600,
          }}>
          {title}
        </Text>
        <Text style={{fontSize: 16}}>{subtitle}</Text>
      </View>
    </Pressable>
  );
};

const HabitList = ({habits, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={{
        backgroundColor: isDarkMode ? blackcolors[6].hex : blackcolors[1].hex,
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: 7,
        columnGap: 7,
        paddingHorizontal: 12,
      }}>
      {habits.map(habit => {
        return (
          <Card
            key={habit.id}
            title={habit.title}
            icon={habit.icon}
            subtitle={habit.verb}
            onPress={() => navigation.navigate('View', {habit: habit})}
          />
        );
      })}
    </View>
  );
};

function HabitOverview({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? blackcolors[8].hex : blackcolors[1].hex,
  };

  const handleOnPress = () => {
    navigation.navigate('Create', {habitId: '1234'});
  };

  const [habitList, setHabitList] = useState([]);
  (async () => {
    setHabitList(await allHabits());
  })();

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View>
        <Section title="Hi Harsh,">Good Afternoon</Section>
      </View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Text style={textStyle}> Total bad habit : {totalHabit} </Text> */}
        <HabitList habits={habitList} navigation={navigation} />
      </ScrollView>
      <AppButton title={'New Habit'} onPress={handleOnPress} />
    </SafeAreaView>
  );
}

function NewHabit({navigation, route}) {
  const isDarkMode = useColorScheme() === 'dark';
  const inputStyle = isDarkMode
    ? styles.inputStyleDark
    : styles.inputStyleLight;

  const [isOpen, setIsOpen] = useState(false);

  const habitTypes = ['Good', 'Bad', 'Neutral'];
  const scaleTypes = ['Stepped', 'Linear'];

  const [htIndex, setHtIndex] = useState(); // HabitType Index
  const [stIndex, setStIndex] = useState(); // ScaleType Index

  const selectHabitType = (val, index) => {
    setHtIndex(index);
    setHabit({...habit, habitType: val});
  };

  const selectScaleType = (val, index) => {
    setStIndex(index);
    setHabit({...habit, scaleType: val});
  };

  const [habit, setHabit] = useState({
    title: 'Smoking',
    icon: '🚬',
    verb: 'Injurios to health',
    habitType: 'neutral',
    scaleLimit: 10,
    scaleType: 'linear',
    scaleStep: 1,
    scaleUnit: 'Qty.',
  });

  const renderVerb = '5/10 ' + habit.verb;
  const handleSavePress = async () => {
    console.log('Saving ...', habit);
    await saveHabit(habit);
    navigation.navigate('Habits');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 2, alignItems: 'center', paddingVertical: 12}}>
        <Card title={habit.title} icon={habit.icon} subtitle={renderVerb} />
      </View>
      <View style={{flex: 6, justifyContent: 'baseline'}}>
        <ButtonGroup
          buttons={habitTypes}
          selectedIndex={htIndex}
          onPress={selectHabitType}
        />
        <View style={{flexDirection: 'row'}}>
          <TextInput
            style={[inputStyle, {flexBasis: '80%'}]}
            placeholder="Habit name (like Smoking)"
            onChangeText={nt => setHabit({...habit, title: nt})}
          />
          <SmallButton title="😊" onPress={() => setIsOpen(true)} />
        </View>
        <EmojiPicker
          onEmojiSelected={e => setHabit({...habit, icon: e.emoji})}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        />
        <TextInput
          style={inputStyle}
          placeholder="Additional details"
          onChangeText={nt => setHabit({...habit, verb: nt})}
        />
        <ButtonGroup
          buttons={scaleTypes}
          selectedIndex={stIndex}
          onPress={selectScaleType}
        />
        <TextInput
          style={inputStyle}
          inputMode="numeric"
          placeholder="Scale limit (like 10, 100 etc.)"
          onChangeText={nt =>
            setHabit({...habit, scaleLimit: parseInt(nt, 10)})
          }
        />
        <TextInput
          style={inputStyle}
          inputMode="numeric"
          placeholder="Scale step (like 1, 2 etc.)"
          onChangeText={nt => setHabit({...habit, scaleStep: parseInt(nt, 10)})}
        />
        <TextInput
          style={inputStyle}
          placeholder="Scale unit (like Kg, Mtr etc.)"
          onChangeText={nt => setHabit({...habit, scaleUnit: nt})}
        />
      </View>
      <View style={[styles.buttonGroup, {flexBasis: '8%'}]}>
        <AppButton
          title="Cancel"
          onPress={() => navigation.navigate('Habits')}
        />
        <AppButton title="Save" onPress={handleSavePress} />
      </View>
    </SafeAreaView>
  );
}

const HabitLogs = ({habit, logs}) => {
  // console.info('Habit logs: ', logs);
  const dateStr = timestamp => {
    return timestamp
      ? new Date(timestamp).toDateString()
      : new Date().toDateString();
  };
  if (logs && logs.length > 0) {
    return (
      <View>
        <ScrollView>
          {logs.map(l => {
            return (
              <Section title={l.scale} key={l.id} style={{color: 'black'}}>
                {l.comment} | {dateStr(l.createdAt)}
              </Section>
            );
          })}
        </ScrollView>
      </View>
    );
  } else {
    return (
      <Text style={{fontSize: 18, padding: 12, color: 'red'}}>
        No logs found
      </Text>
    );
  }
};

function SmallButton({title, onPress}) {
  const isDarkMode = useColorScheme() === 'dark';
  const btnColor = isDarkMode ? 'white' : 'black';
  return (
    <Pressable
      style={[styles.smallButton, {borderColor: btnColor, color: btnColor}]}
      onPress={onPress}>
      <Text style={{textTransform: 'uppercase', color: btnColor, fontSize: 24}}>
        {title}
      </Text>
    </Pressable>
  );
}

function DeleteButton({confirmation, onPress}) {
  const handleDelete = () => {
    if (confirmation) {
      // open confirmation
      Alert.alert('Confirmation', 'Are you sure ?', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => onPress()},
      ]);
    } else {
      onPress();
    }
  };
  return (
    <Pressable
      style={[
        styles.smallButton,
        {flexBasis: '17%', borderColor: 'red', color: 'red'},
      ]}
      onPress={handleDelete}>
      <Text style={{textTransform: 'uppercase', color: 'red', fontSize: 12}}>
        Delete
      </Text>
    </Pressable>
  );
}

function EditHabit({habit, sheetRef}) {
  const isDarkMode = useColorScheme() === 'dark';
  const inputStyle = isDarkMode
    ? styles.inputStyleDark
    : styles.inputStyleLight;

  const [title, setTitle] = useState(habit.title);
  const [icon, setIcon] = useState(habit.icon);
  const [verb, setVerb] = useState(habit.verb);
  const [isOpen, setIsOpen] = useState(false);

  const handleEdit = async () => {
    await updateHabit({
      habit: habit,
      newTitle: title,
      newIcon: icon,
      newVerb: verb,
    });
  };

  return (
    <View>
      <TextInput
        style={inputStyle}
        value={title}
        onChangeText={nt => setTitle(nt)}
      />
      <SmallButton title={icon} onPress={() => setIsOpen(true)} />
      <EmojiPicker
        onEmojiSelected={e => setIcon(e.emoji)}
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
      <TextInput
        style={inputStyle}
        value={verb}
        onChangeText={nt => setVerb(nt)}
      />
      <AppButton title="Save" onPress={handleEdit} />
    </View>
  );
}

function ViewHabit({navigation, route}) {
  const crntHabit = route.params.habit;
  // getAllLogs()
  //   .then(allLogs => {
  //     allLogs.forEach(l => {
  //       console.log(
  //         `Id: ${l.id} scale: ${l.scale} comment: ${l.comment} habit: ${l.habit}`,
  //       );
  //     });
  //   })
  //   .catch(error => {
  //     console.error('Error fetching logs:', error);
  //   });
  const logSheetRef = useRef(null);
  const editSheetRef = useRef(null);

  const handleDelete = async () => {
    await deleteHabit(crntHabit);
    navigation.navigate('Habits');
  };

  const handleEdit = () => {
    editSheetRef.current.expand();
  };
  // const handleLogPress = () => {
  //   navigation.navigate('Log', {habit: crntHabit});
  // };

  const enhance = withObservables(['habit'], ({habit}) => ({
    habit,
    logs: habit.habitlogs,
  }));

  const EnhancedLogs = enhance(HabitLogs);

  /* <SmallButton title="Edit" onPress={handleEdit} /> Don't provide edit option for now */
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <Text style={[styles.header1, {flexBasis: '81%'}]}>
          {crntHabit.title}
        </Text>
        <DeleteButton confirmation={true} onPress={handleDelete} />
      </View>
      {crntHabit ? (
        <EnhancedLogs habit={crntHabit} />
      ) : (
        <HabitLogs habit={{title: ''}} logs={[]} />
      )}
      <BottomSheet
        snapPoints={[60, '60%']}
        enablePanDownToClose={true}
        ref={editSheetRef}>
        <BottomSheetView style={{flex: 1, paddingHorizontal: 7}}>
          <Text style={{alignSelf: 'center', fontSize: 20}}>Edit</Text>
          <EditHabit habit={crntHabit} sheetRef={editSheetRef} />
          <AppButton
            title="Cancel"
            onPress={() => editSheetRef.current.close()}
          />
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet snapPoints={[60, '40%']} topInset={2} ref={logSheetRef}>
        <BottomSheetView style={{flex: 1, paddingHorizontal: 7}}>
          <Text style={{alignSelf: 'center', fontSize: 20}}>Log</Text>
          <LogHabit habit={crntHabit} />
        </BottomSheetView>
      </BottomSheet>
      {/* <AppButton onPress={handleLogPress} title="Create Log" /> */}
    </SafeAreaView>
  );
}

function LogHabit({habit}) {
  const isDarkMode = useColorScheme() === 'dark';
  const inputStyle = isDarkMode
    ? styles.inputStyleDark
    : styles.inputStyleLight;

  const [log, setLog] = useState({
    scale: 0,
    comment: '',
    habit: habit,
  });
  const progress = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(habit.scaleLimit);
  const step = useSharedValue(habit.scaleStep);
  const snapToStep = habit.scaleType === 'Stepped' ? true : false;

  const handleLogSave = async () => {
    logHabit(log)
      .then(newLog => {
        console.log('Saved new log', newLog);
        setLog({scale: 0, comment: '', habit: log.habit});
      })
      .catch(err => {
        console.error('Failed to save log', err);
      });
  };

  const handleCommentChange = val => {
    setLog({...log, comment: val});
  };

  const handleSliderChange = val => {
    setLog({...log, scale: val});
  };

  return (
    <View style={{flex: 1}}>
      <Text style={{alignSelf: 'center'}}>
        {log.scale} / {habit.scaleLimit} {habit.scaleUnit}
      </Text>
      <Slider
        style={{marginHorizontal: 10}}
        containerStyle={{
          borderRadius: 10,
          backgroundColor: inputStyle.backgroundColor,
          maximumTrackTintColor: primarycolors[0].hex,
          minimumTrackTintColor: primarycolors[3].hex,
        }}
        sliderHeight={10}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        step={10}
        snapToStep={true}
        onSlidingComplete={handleSliderChange}
      />
      <TextInput
        style={inputStyle}
        placeholder="Comments ..."
        onChangeText={handleCommentChange}
      />
      <AppButton onPress={handleLogSave} title="Save" />
    </View>
  );
}

function App() {
  Appearance.setColorScheme('light');
  return (
    <GestureHandlerRootView style={{flex: 1, flexGrow: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Habits">
          <Stack.Screen name="Habits" component={HabitOverview} />
          <Stack.Screen name="Create" component={NewHabit} />
          <Stack.Screen name="View" component={ViewHabit} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const primarycolors = [
  {
    name: 'blue-1',
    hex: '#c2d9ff',
    rgb: [194, 217, 255],
    hsl: [217.4, 100, 88],
  },
  {
    name: 'blue-2',
    hex: '#7752fe',
    rgb: [119, 82, 254],
    hsl: [252.2, 98.9, 65.9],
  },
  {
    name: 'blue-3',
    hex: '#8e8ffa',
    rgb: [142, 143, 250],
    hsl: [239.4, 91.5, 76.9],
  },
  {
    name: 'blue-4',
    hex: '#190482',
    rgb: [25, 4, 130],
    hsl: [250, 94, 26.3],
  },
];

const statuscolors = [
  {
    name: 'red-10',
    hex: '#03071e',
    rgb: [3, 7, 30],
    hsl: [231, 82, 6],
  },
  {
    name: 'red-9',
    hex: '#370617',
    rgb: [55, 6, 23],
    hsl: [339, 80, 12],
  },
  {
    name: 'red-8',
    hex: '#6a040f',
    rgb: [106, 4, 15],
    hsl: [354, 93, 22],
  },
  {
    name: 'red-7',
    hex: '#9d0208',
    rgb: [157, 2, 8],
    hsl: [358, 97, 31],
  },
  {
    name: 'red-6',
    hex: '#d00000',
    rgb: [208, 0, 0],
    hsl: [0, 100, 41],
  },
  {
    name: 'red-5',
    hex: '#dc2f02',
    rgb: [220, 47, 2],
    hsl: [12, 98, 44],
  },
  {
    name: 'red-4',
    hex: '#e85d04',
    rgb: [232, 93, 4],
    hsl: [23, 97, 46],
  },
  {
    name: 'red-3',
    hex: '#f48c06',
    rgb: [244, 140, 6],
    hsl: [34, 95, 49],
  },
  {
    name: 'red-2',
    hex: '#faa307',
    rgb: [250, 163, 7],
    hsl: [39, 96, 50],
  },
  {
    name: 'red-1',
    hex: '#ffba08',
    rgb: [255, 186, 8],
    hsl: [43, 100, 52],
  },
];
const blackcolors = [
  {
    name: 'black-1',
    hex: 'f8f9fa',
    rgb: [248, 249, 250],
    hsl: [210, 17, 98],
  },
  {
    name: 'black-2',
    hex: '#e9ecef',
    rgb: [233, 236, 239],
    hsl: [210, 16, 93],
  },
  {
    name: 'black-3',
    hex: '#dee2e6',
    rgb: [222, 226, 230],
    hsl: [210, 14, 89],
  },
  {
    name: 'black-4',
    hex: '#ced4da',
    rgb: [206, 212, 218],
    hsl: [210, 14, 83],
  },
  {
    name: 'black-5',
    hex: '#adb5bd',
    rgb: [173, 181, 189],
    hsl: [210, 11, 71],
  },
  {
    name: 'black-6',
    hex: '#6c757d',
    rgb: [108, 117, 125],
    hsl: [208, 7, 46],
  },
  {
    name: 'black-7',
    hex: '#495057',
    rgb: [73, 80, 87],
    hsl: [210, 9, 31],
  },
  {
    name: 'black-8',
    hex: '#343a40',
    rgb: [52, 58, 64],
    hsl: [210, 10, 23],
  },
  {
    name: 'black-9',
    hex: '#212529',
    rgb: [33, 37, 41],
    hsl: [210, 11, 15],
  },
];
const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  textBox: {
    borderColor: '#010101',
    marginVertical: 8,
    marginHorizontal: 4,
    height: 40,
  },
  appButtonContainer: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: 10,
    marginBottom: 8,
    maxHeight: 50,
    minWidth: '45%',
  },
  appButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  inputStyleDark: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    backgroundColor: blackcolors[7].hex,
    borderWidth: 1,
    borderColor: blackcolors[5].hex,
  },
  inputStyleLight: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: blackcolors[1].hex,
    borderWidth: 1,
    borderColor: blackcolors[3].hex,
  },
  darkBg: {
    backgroundColor: blackcolors[8].hex,
  },
  lightBg: {
    backgroundColor: blackcolors[1].hex,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'no-wrap',
    justifyContent: 'space-around',
  },
  header1: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    paddingTop: 12,
    paddingLeft: 12,
  },
  smallButton: {
    borderRadius: 10,
    alignItems: 'center',
    padding: 4,
    borderWidth: 1,
    margin: 10,
    marginLeft: 2,
    flexBasis: '12%',
  },
});

export default App;
