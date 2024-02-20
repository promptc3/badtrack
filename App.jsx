/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  Button,
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

import {Colors} from 'react-native/Libraries/NewAppScreen';

import {useSharedValue} from 'react-native-reanimated';
import {Slider} from 'react-native-awesome-slider';

import {GestureHandlerRootView} from 'react-native-gesture-handler';

import {
  saveHabit,
  habitCount,
  logHabit,
  allHabits,
  observeHabit,
} from './model/helper';
import {withObservables} from '@nozbe/watermelondb/react';

const Stack = createNativeStackNavigator();

function Section({children, title, onPress}) {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Pressable onPress={onPress}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: isDarkMode ? Colors.white : Colors.black,
            },
          ]}>
          {title}
        </Text>
        <Text
          style={[
            styles.sectionDescription,
            {
              color: isDarkMode ? Colors.light : Colors.dark,
            },
          ]}>
          {children}
        </Text>
      </Pressable>
    </View>
  );
}

const HabitList = ({habits, navigation}) => {
  return (
    <View
      style={{
        backgroundColor: Colors.darker,
      }}>
      {habits.map(habit => {
        return (
          <Section
            key={habit.id}
            title={habit.title}
            onPress={() => {
              navigation.navigate('View', {habitId: habit.id});
            }}>
            {habit.id} | {habit.icon} | {habit.verb}
          </Section>
        );
      })}
    </View>
  );
};

function HabitOverview({navigation}) {
  const isDarkMode = useColorScheme() === 'dark';

  const [totalHabit, setTotalHabit] = useState(0);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleOnPress = () => {
    navigation.navigate('Create', {habitId: '1234'});
  };

  const [habitList, setHabitList] = useState([]);
  useEffect(() => {
    (async () => {
      setHabitList(await allHabits());
    })();
    (async () => {
      setTotalHabit(await habitCount());
    })();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Badtrack">For the ones fueled by negativity</Section>
        </View>
        <Text style={{color: Colors.lighter, fontSize: 14}}>
          Total bad habit : {totalHabit}
        </Text>
        <HabitList habits={habitList} navigation={navigation} />
        <Button onPress={handleOnPress} title="New" color={'#2e2e2e'} />
      </ScrollView>
    </SafeAreaView>
  );
}

function NewHabit({navigation, route}) {
  const [habitName, setHabitName] = useState('');
  const [habitIcon, setHabitIcon] = useState('');
  const [habitVerb, setHabitVerb] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePress = async () => {
    setIsSaving(true);
    await saveHabit(habitName, habitIcon, habitVerb);
    setHabitName('');
    setHabitIcon('');
    setHabitVerb('');
    setIsSaving(false);
    navigation.navigate('Habits');
  };

  return (
    <Section title="New Habit">
      <View style={{padding: 10, backgroundColor: Colors.black}}>
        <TextInput
          style={{
            borderColor: '#010101',
            marginVertical: 8,
            marginHorizontal: 4,
            height: 40,
          }}
          placeholder="Habit name (like Smoking)"
          onChangeText={nt => setHabitName(nt)}
        />
        <TextInput
          style={{marginVertical: 8, marginHorizontal: 4, height: 40}}
          placeholder="Icon to represent your habit"
          onChangeText={nt => setHabitIcon(nt)}
        />
        <TextInput
          style={{marginVertical: 8, marginHorizontal: 4, height: 40}}
          placeholder="Habit verb (like Smoked)"
          onChangeText={nt => setHabitVerb(nt)}
        />
      </View>
      <Section title={habitName}>
        Id: {route.params.habitId} | Icon: {habitIcon} | Verb: {habitVerb}
      </Section>
      <Button title="Save" disabled={isSaving} onPress={handleSavePress} />
      <Button title="Cancel" onPress={() => navigation.navigate('Habits')} />
    </Section>
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
      <Button onPress={handleLogPress} title="Create Log" color={'#2e2e2e'} />
    </View>
  );
}

function LogHabit({navigation, route}) {
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

  return (
    <View>
      <Text>How bad is it ?</Text>
      <Slider
        progress={progress}
        minimumValue={min}
        maximumValue={max}
        onSlidingComplete={handleSliderChange}
      />
      <TextInput
        style={styles.textBox}
        placeholder="Comments ..."
        onChangeText={handleCommentChange}
      />
      <Button onPress={handleLogSave} title="Save" color={'#2e2e2e'} />
    </View>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
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
});

export default App;
