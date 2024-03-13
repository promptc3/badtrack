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
import {Slider} from 'react-native-awesome-slider';

import {FlatList, GestureHandlerRootView} from 'react-native-gesture-handler';

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

const green = [
  '#02cc93',
  '#06d197',
  '#09d59b',
  '#0ddaa0',
  '#10dea4',
  '#14e3a8',
  '#17e7ac',
  '#1becb1',
  '#1ef0b5',
  '#1effb5',
];
const red = [
  '#03071e',
  '#370617',
  '#6a040f',
  '#9d0208',
  '#d00000',
  '#dc2f02',
  '#e85d04',
  '#f48c06',
  '#faa307',
  '#ffa307',
];
const blue = [
  '#024686',
  '#02529c',
  '#025eb2',
  '#1f7fd8',
  '#3ba0fd',
  '#5cb0fe',
  '#7cc0fe',
  '#9dd0fe',
  '#bedffe',
  '#bed0ff',
];
const black = [
  '#f8f9fa',
  '#e9ecef',
  '#dee2e6',
  '#ced4da',
  '#adb5bd',
  '#6c757d',
  '#495057',
  '#343a40',
  '#212529',
  '#010101',
];
const Stack = createNativeStackNavigator();

function ButtonGroup({buttons, selectedIndex, onPress}) {
  const isDarkMode = useColorScheme() === 'dark';
  const bgColor = isDarkMode ? black[6] : black[1];
  const activeColor = isDarkMode ? blue[2] : blue[6];
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
    if (activeIndex !== undefined && index === activeIndex) {
      return {backgroundColor: activeColor};
    } else {
      return {backgroundColor: bgColor};
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
            <Text style={{color: black[7].hex, alignSelf: 'center'}}>{b}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const AppButton = ({title, onPress}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? black[6] : black[2],
  };
  return (
    <Pressable
      onPress={onPress}
      style={[styles.appButtonContainer, backgroundStyle]}>
      <Text
        style={[
          styles.appButtonText,
          {color: isDarkMode ? black[3] : black[6]},
        ]}>
        {title}
      </Text>
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
          backgroundColor: isDarkMode ? black[7] : black[1],
        },
      ]}>
      <Pressable onPress={onPress}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? black[0] : black[7],
            },
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? black[1] : black[7],
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
          backgroundColor: isDarkMode ? black[8] : black[0],
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
            opacity: 1,
            color: black[0],
          }}>
          {icon}
        </Text>
        <Text
          style={{
            fontFamily: 'Poppins-Regular',
            fontSize: 20,
            fontWeight: 600,
            color: isDarkMode ? black[1] : black[8],
          }}>
          {title}
        </Text>
        <Text style={{fontSize: 16, color: isDarkMode ? black[3] : black[8]}}>
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
};

const HabitList = ({habits, navigation}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View
      style={{
        backgroundColor: isDarkMode ? black[7] : black[1],
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
    backgroundColor: isDarkMode ? black[7] : black[1],
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
      <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
        <Section title="Simpletrack">Minimal & Offline Habit Tracker</Section>
        <ThemeSwitcher />
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

  const bgColor = isDarkMode ? black[7] : black[1];
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
    <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
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

function FlatListItem({item}) {
  const isDarkMode = useColorScheme() === 'dark';
  const scaleColor = isDarkMode ? black[0] : black[8];
  const commentColor = isDarkMode ? black[1] : black[7];
  const dateColor = isDarkMode ? black[3] : black[5];
  const dateStr = timestamp => {
    return timestamp
      ? new Date(timestamp).toDateString() +
          '@' +
          new Date(timestamp).toLocaleTimeString('en-US')
      : new Date().toDateString();
  };
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 10,
        marginVertical: 10,
        marginLeft: 8,
      }}>
      <Text style={{fontSize: 30, color: scaleColor}}>{item.scale}</Text>
      <View>
        <Text style={{color: commentColor, fontSize: 14}}>{item.comment}</Text>
        <Text style={{color: dateColor, fontSize: 14}}>
          {dateStr(item.createdAt)}
        </Text>
      </View>
    </View>
  );
}
const HabitLogs = ({habit, logs}) => {
  const isDarkMode = useColorScheme() === 'dark';
  const bgColor = isDarkMode ? black[8] : black[1];
  if (logs && logs.length > 0) {
    return (
      <View>
        <FlatList
          style={{backgroundColor: bgColor, borderRadius: 6, margin: 8}}
          data={logs}
          renderItem={({item}) => <FlatListItem item={item} />}
        />
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

function SmallButton({title, onPress, borderVisible}) {
  const isDarkMode = useColorScheme() === 'dark';
  const btnColor = isDarkMode ? 'white' : 'black';
  const borderWidth = borderVisible ? 1 : 0;
  return (
    <Pressable
      style={[
        styles.smallButton,
        {
          borderWidth: borderWidth,
          borderColor: btnColor,
          color: btnColor,
          justifyContent: 'center',
        },
      ]}
      onPress={onPress}>
      <Text style={{textTransform: 'uppercase', color: btnColor, fontSize: 24}}>
        {title}
      </Text>
    </Pressable>
  );
}

function ThemeSwitcher() {
  const [title, setTitle] = useState('☀️');
  const isDarkMode = useColorScheme() === 'dark';
  const switchTheme = () => {
    if (isDarkMode) {
      Appearance.setColorScheme('light');
      setTitle('☀️');
    } else {
      Appearance.setColorScheme('dark');
      setTitle('🌙');
    }
  };
  return (
    <SmallButton title={title} onPress={switchTheme} borderVisible={false} />
  );
}
function DeleteButton({confirmation, onPress}) {
  const handleDelete = () => {
    if (confirmation) {
      // open confirmation
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete this habit ?',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'OK', onPress: () => onPress()},
        ],
      );
    } else {
      onPress();
    }
  };
  return (
    <Pressable
      style={[
        styles.smallButton,
        {
          flexBasis: '17%',
          borderColor: 'red',
          color: 'red',
          justifyContent: 'center',
        },
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
      <SmallButton
        title={icon}
        onPress={() => setIsOpen(true)}
        borderVisible={true}
      />
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
  const isDarkMode = useColorScheme() === 'dark';
  const bgColor = isDarkMode ? black[7] : black[1];
  const sheetBgColor = isDarkMode ? black[8] : black[1];
  const indicatorColor = isDarkMode ? black[0] : black[9];
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
    <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
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
        style={{backgroundColor: sheetBgColor}}
        ref={editSheetRef}>
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 7,
            backgroundColor: sheetBgColor,
          }}>
          <Text style={{alignSelf: 'center', fontSize: 20}}>Edit</Text>
          <EditHabit habit={crntHabit} sheetRef={editSheetRef} />
          <AppButton
            title="Cancel"
            onPress={() => editSheetRef.current.close()}
          />
        </BottomSheetView>
      </BottomSheet>
      <BottomSheet
        snapPoints={[60, '40%']}
        topInset={2}
        ref={logSheetRef}
        handleStyle={{backgroundColor: sheetBgColor}}
        handleIndicatorStyle={{backgroundColor: indicatorColor}}>
        <BottomSheetView
          style={{
            flex: 1,
            paddingHorizontal: 7,
            backgroundColor: sheetBgColor,
          }}>
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

  const sliderBg = isDarkMode ? black[7] : black[0];
  const [log, setLog] = useState({
    scale: 0,
    comment: '',
    habit: habit,
  });
  const getTintColor = index => {
    if (habit.habitType) {
      if (habit.habitType === 'Good') {
        return green[index];
      } else if (habit.habitType === 'Bad') {
        return red[index];
      } else {
        return blue[index];
      }
    } else {
      return blue[index];
    }
  };
  const [progressColor, setProgressColor] = useState(getTintColor(0));
  const maxVal = habit.scaleLimit > 0 ? habit.scaleLimit : 100;
  const min = useSharedValue(0);
  const max = useSharedValue(maxVal);
  const progress = useSharedValue(0);

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

  const unitStep = maxVal / 10;

  const handleSliderChange = val => {
    setLog({...log, scale: val});
  };

  const handleColorChange = val => {
    setProgressColor(getTintColor(10 - Math.floor(val / unitStep)));
  };

  // console.log(`${habit.title}-${habit.scaleLimit}-${getTintColor(7)}`);
  return (
    <View style={{flex: 1}}>
      <Text style={[styles.header1, {alignSelf: 'center'}]}>
        {log.scale} / {habit.scaleLimit} {habit.scaleUnit}
      </Text>
      <Slider
        style={{borderRadius: 10, marginHorizontal: 10}}
        theme={{
          disableMinTrackTintColor: '#fff',
          maximumTrackTintColor: sliderBg,
          minimumTrackTintColor: progressColor,
          cacheTrackTintColor: '#333',
          bubbleBackgroundColor: '#666',
        }}
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        step={10}
        snapToStep
        thumbWidth={10}
        sliderHeight={60}
        containerStyle={{
          borderRadius: 10,
        }}
        onSlidingComplete={handleSliderChange}
        onValueChange={handleColorChange}
      />
      <TextInput
        style={[inputStyle, {borderRadius: 10}]}
        placeholder="Comments ..."
        value={log.comment}
        onChangeText={handleCommentChange}
      />
      <AppButton onPress={handleLogSave} title="Save" />
    </View>
  );
}

function App() {
  Appearance.setColorScheme('dark');
  const isDarkMode = useColorScheme() === 'dark';
  const headerBg = isDarkMode ? black[7] : black[1];
  return (
    <GestureHandlerRootView style={{flex: 1, flexGrow: 1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Habits"
          screenOptions={{
            headerStyle: {
              backgroundColor: headerBg,
            },
            headerShadowVisible: false,
            headerTitleStyle: {
              color: isDarkMode ? black[3] : black[8],
            },
          }}>
          <Stack.Screen
            name="Habits"
            component={HabitOverview}
            options={{
              header: () => {
                null;
              },
            }}
          />
          <Stack.Screen
            name="Create"
            component={NewHabit}
            options={{
              title: 'Create habit',
              headerBackVisible: false,
            }}
          />
          <Stack.Screen
            name="View"
            component={ViewHabit}
            options={{
              title: 'View habit',
              headerBackVisible: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 16,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Poppins-Bold',
  },
  sectionDescription: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Poppins-Regular',
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
    backgroundColor: black[7],
    borderWidth: 1,
    borderColor: black[5],
    borderRadius: 10,
  },
  inputStyleLight: {
    padding: 12,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: black[0],
    borderWidth: 1,
    borderColor: black[2],
  },
  darkBg: {
    backgroundColor: black[7],
  },
  lightBg: {
    backgroundColor: black[0],
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
    marginBottom: 8,
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
