import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import { auth } from '../../services/firebase/config';
import {
    getUserStats,
    calculateStreak,
    getWeeklySessions,
} from '../../services/firebase/firestore';
import { DARK_COLORS, COLORS } from '../../constants/colors';
import { FONT_SIZES, FONT_WEIGHTS } from '../../constants/typography';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';

type Props = any; // Accept any navigation props from both tab and stack

const { width } = Dimensions.get('window');

interface Stats {
    totalMinutes: number;
    totalSessions: number;
    currentStreak: number;
    longestStreak: number;
}

const ProgressScreen: React.FC<Props> = ({ navigation }) => {
    const [stats, setStats] = useState<Stats>({
        totalMinutes: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
    });
    const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
    const [markedDates, setMarkedDates] = useState<any>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        if (!auth.currentUser) return;

        try {
            setLoading(true);
            const [userStats, streakData, sessions] = await Promise.all([
                getUserStats(auth.currentUser.uid),
                calculateStreak(auth.currentUser.uid),
                getWeeklySessions(auth.currentUser.uid),
            ]);

            if (userStats) {
                setStats({
                    ...userStats,
                    currentStreak: streakData.currentStreak,
                    longestStreak: streakData.longestStreak,
                });
            }

            // Process weekly data for chart
            const weekData = [0, 0, 0, 0, 0, 0, 0];
            const marked: any = {};

            sessions.forEach((session: any) => {
                const date = session.completedAt.toDate();
                const dayOfWeek = date.getDay();
                weekData[dayOfWeek] += session.durationMinutes || 0;

                // Mark dates for calendar
                const dateString = date.toISOString().split('T')[0];
                marked[dateString] = {
                    marked: true,
                    dotColor: COLORS.sageGreen,
                    selected: true,
                    selectedColor: COLORS.sageGreen + '40',
                };
            });

            setWeeklyData(weekData);
            setMarkedDates(marked);
        } catch (error) {
            console.error('Error loading progress data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAchievements = () => {
        const achievements = [];

        if (stats.totalSessions >= 1) {
            achievements.push({ icon: '🎯', title: 'First Step', desc: 'Complete your first workout' });
        }
        if (stats.totalSessions >= 10) {
            achievements.push({ icon: '💪', title: 'Committed', desc: 'Complete 10 workouts' });
        }
        if (stats.currentStreak >= 3) {
            achievements.push({ icon: '🔥', title: 'On Fire', desc: '3-day streak' });
        }
        if (stats.currentStreak >= 7) {
            achievements.push({ icon: '⭐', title: 'Week Warrior', desc: '7-day streak' });
        }
        if (stats.totalMinutes >= 60) {
            achievements.push({ icon: '⏱️', title: 'Hour Power', desc: '60+ minutes practiced' });
        }
        if (stats.totalMinutes >= 300) {
            achievements.push({ icon: '🏆', title: 'Dedicated', desc: '5+ hours practiced' });
        }

        return achievements;
    };

    const chartConfig = {
        backgroundColor: DARK_COLORS.surface,
        backgroundGradientFrom: DARK_COLORS.surface,
        backgroundGradientTo: DARK_COLORS.surface,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(139, 195, 74, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity * 0.6})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: COLORS.sageGreen,
        },
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color={DARK_COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Your Progress</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0 }}
                        style={styles.statCard}
                    >
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statGradient}
                        >
                            <Ionicons name="time" size={32} color={COLORS.white} />
                            <Text style={styles.statValue}>{stats.totalMinutes}</Text>
                            <Text style={styles.statLabel}>Minutes</Text>
                        </LinearGradient>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 100 }}
                        style={styles.statCard}
                    >
                        <LinearGradient
                            colors={['#f093fb', '#f5576c']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statGradient}
                        >
                            <Ionicons name="checkmark-circle" size={32} color={COLORS.white} />
                            <Text style={styles.statValue}>{stats.totalSessions}</Text>
                            <Text style={styles.statLabel}>Sessions</Text>
                        </LinearGradient>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 200 }}
                        style={styles.statCard}
                    >
                        <LinearGradient
                            colors={['#fa709a', '#fee140']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statGradient}
                        >
                            <Ionicons name="flame" size={32} color={COLORS.white} />
                            <Text style={styles.statValue}>{stats.currentStreak}</Text>
                            <Text style={styles.statLabel}>Day Streak</Text>
                        </LinearGradient>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 300 }}
                        style={styles.statCard}
                    >
                        <LinearGradient
                            colors={['#4facfe', '#00f2fe']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.statGradient}
                        >
                            <Ionicons name="trophy" size={32} color={COLORS.white} />
                            <Text style={styles.statValue}>{stats.longestStreak}</Text>
                            <Text style={styles.statLabel}>Best Streak</Text>
                        </LinearGradient>
                    </MotiView>
                </View>

                {/* Weekly Activity Chart */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Weekly Activity</Text>
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={{
                                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                                datasets: [{ data: weeklyData }],
                            }}
                            width={width - 40}
                            height={220}
                            yAxisLabel=""
                            yAxisSuffix="m"
                            chartConfig={chartConfig}
                            style={styles.chart}
                            showValuesOnTopOfBars
                            fromZero
                        />
                    </View>
                </View>

                {/* Streak Calendar */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Workout Calendar</Text>
                    <View style={styles.calendarContainer}>
                        <Calendar
                            markedDates={markedDates}
                            theme={{
                                calendarBackground: DARK_COLORS.surface,
                                textSectionTitleColor: DARK_COLORS.textSecondary,
                                selectedDayBackgroundColor: COLORS.sageGreen,
                                selectedDayTextColor: COLORS.white,
                                todayTextColor: COLORS.sageGreen,
                                dayTextColor: DARK_COLORS.text,
                                textDisabledColor: DARK_COLORS.textSecondary + '40',
                                monthTextColor: DARK_COLORS.text,
                                textMonthFontWeight: 'bold',
                                textDayFontSize: 14,
                                textMonthFontSize: 16,
                            }}
                            style={styles.calendar}
                        />
                    </View>
                </View>

                {/* Achievements */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Achievements</Text>
                    <View style={styles.achievementsGrid}>
                        {getAchievements().map((achievement, index) => (
                            <MotiView
                                key={index}
                                from={{ opacity: 0, translateY: 20 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: index * 100 }}
                                style={styles.achievementCard}
                            >
                                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                                <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                            </MotiView>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: DARK_COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    title: {
        fontSize: FONT_SIZES.h2,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
    },
    content: {
        padding: 20,
        paddingTop: 0,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 24,
    },
    statCard: {
        width: (width - 52) / 2,
        height: 140,
        borderRadius: 20,
        overflow: 'hidden',
    },
    statGradient: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    statValue: {
        fontSize: 32,
        fontWeight: FONT_WEIGHTS.bold,
        color: COLORS.white,
    },
    statLabel: {
        fontSize: FONT_SIZES.small,
        color: COLORS.white,
        opacity: 0.9,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: FONT_SIZES.h3,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        marginBottom: 16,
    },
    chartContainer: {
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    chart: {
        borderRadius: 16,
    },
    calendarContainer: {
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    calendar: {
        borderRadius: 16,
    },
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    achievementCard: {
        width: (width - 52) / 2,
        backgroundColor: DARK_COLORS.surface,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: DARK_COLORS.border,
    },
    achievementIcon: {
        fontSize: 40,
        marginBottom: 8,
    },
    achievementTitle: {
        fontSize: FONT_SIZES.body,
        fontWeight: FONT_WEIGHTS.bold,
        color: DARK_COLORS.text,
        marginBottom: 4,
        textAlign: 'center',
    },
    achievementDesc: {
        fontSize: FONT_SIZES.small,
        color: DARK_COLORS.textSecondary,
        textAlign: 'center',
    },
});

export default ProgressScreen;
