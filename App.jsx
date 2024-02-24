/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import {
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

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {saveHabit, logHabit, allHabits, observeHabit} from './model/helper';
import {withObservables} from '@nozbe/watermelondb/react';

const Stack = createNativeStackNavigator();

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
  const renderIcon = icon.substring(0, 1);
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
            color: primarycolors[2].hex,
          }}>
          {renderIcon}
        </Text>
        <Text style={{fontSize: 18, fontWeight: 600}}>{title}</Text>
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
            onPress={() => navigation.navigate('View', {habitId: habit.id})}
          />
        );
      })}
    </View>
  );
};

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

  const [habitName, setHabitName] = useState('Smoking');
  const [habitIcon, setHabitIcon] = useState('S');
  const [habitVerb, setHabitVerb] = useState('5/10 cigarretes smoked');

  const handleSavePress = async () => {
    await saveHabit(habitName, habitIcon, habitVerb);
    setHabitName('');
    setHabitIcon('');
    setHabitVerb('');
    navigation.navigate('Habits');
  };

  const renderVerb = '5/10 ' + habitVerb;

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 2, alignItems: 'center', paddingVertical: 12}}>
        <Card title={habitName} icon={habitIcon} subtitle={renderVerb} />
      </View>
      <View style={{flex: 4, justifyContent: 'baseline'}}>
        <TextInput
          style={inputStyle}
          placeholder="Icon to represent your habit"
          onChangeText={nt => setHabitIcon(nt)}
        />
        <TextInput
          style={inputStyle}
          placeholder="Habit name (like Smoking)"
          onChangeText={nt => setHabitName(nt)}
        />
        <TextInput
          style={inputStyle}
          placeholder="Habit verb (like Smoked)"
          onChangeText={nt => setHabitVerb(nt)}
        />
      </View>
      <View style={styles.buttonGroup}>
        <AppButton
          title="Cancel"
          onPress={() => navigation.navigate('Habits')}
        />
        <AppButton title="Save" onPress={handleSavePress} />
      </View>
    </View>
  );
}

const HabitLogs = ({habit}) => {
  let logs = [];
  (async () => {
    logs = await habit.habitlogs;
  })();
  if (logs) {
    return (
      <Section title={habit.title}>
        {logs.map(l => {
          return (
            <Text>
              Scale: {l.scale} | {l.comment} | {l.created_at}{' '}
            </Text>
          );
        })}
      </Section>
    );
  } else {
    return (
      <Section title={habit.title}>
        <Text>No logs found</Text>
      </Section>
    );
  }
};

function ViewHabit({navigation, route}) {
  const enhance = withObservables([], ({}) => ({
    habit: observeHabit(route.params.habitId),
  }));

  const handleLogPress = () => {
    navigation.navigate('Log', {habitId: route.params.habitId});
  };

  const EnhancedLogs = enhance(HabitLogs);
  return (
    <View>
      <EnhancedLogs />
      <AppButton onPress={handleLogPress} title="Create Log" />
    </View>
  );
}

function LogHabit({navigation, route}) {
  const isDarkMode = useColorScheme() === 'dark';
  const inputStyle = isDarkMode
    ? styles.inputStyleDark
    : styles.inputStyleLight;

  const [log, setLog] = useState({
    scale: 0,
    comment: '',
    habitId: route.params.habitId,
  });
  const progress = useSharedValue(1);
  const min = useSharedValue(0);
  const max = useSharedValue(10);

  const handleLogSave = async () => {
    await logHabit(log);
    navigation.navigate('View', {habitId: route.params.habitId});
  };

  const handleCommentChange = val => {
    setLog({scale: log.scale, comment: val, habitId: log.habitId});
  };

  const handleSliderChange = val => {
    setLog({scale: val, comment: log.comment, habitId: log.habitId});
  };

  const bgStyle = isDarkMode ? styles.darkBg : styles.lightBg;
  return (
    <View style={[bgStyle, {flex: 1}]}>
      <View style={{marginTop: 20, paddingVertical: 16, paddingHorizontal: 12}}>
        <Slider
          containerStyle={{
            borderRadius: 10,
            overflow: 'hidden',
            marginTop: 50,
            backgroundColor: inputStyle.backgroundColor,
            maximumTrackTintColor: primarycolors[0].hex,
            minimumTrackTintColor: primarycolors[3].hex,
          }}
          sliderHeight={50}
          progress={progress}
          minimumValue={min}
          maximumValue={max}
          onSlidingComplete={handleSliderChange}
        />
      </View>
      <View
        style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-end'}}>
        <TextInput
          style={inputStyle}
          placeholder="Comments ..."
          onChangeText={handleCommentChange}
        />
        <AppButton onPress={handleLogSave} title="Save" />
      </View>
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
          <Stack.Screen name="Log" component={LogHabit} />
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
    padding: 16,
    marginVertical: 10,
    backgroundColor: blackcolors[7].hex,
    borderWidth: 1,
    borderColor: blackcolors[5].hex,
  },
  inputStyleLight: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: blackcolors[2].hex,
    borderWidth: 1,
    borderColor: blackcolors[4].hex,
  },
  darkBg: {
    backgroundColor: blackcolors[8].hex,
  },
  lightBg: {
    backgroundColor: blackcolors[1].hex,
  },
  buttonGroup: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'no-wrap',
    justifyContent: 'space-around',
  },
});

export default App;
