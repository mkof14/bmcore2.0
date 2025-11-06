import { Clock, Zap, FileText, Sparkles, Bell, Settings, TrendingUp, AlertCircle, BookOpen } from 'lucide-react';
import DeviceScenarios from './DeviceScenarios';

interface EducationSection {
  icon: typeof Clock;
  title: string;
  content: string;
  highlight?: string;
}

export function RealTimeBehaviorSection() {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
          <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Режимы передачи данных
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            После подключения устройство может передавать данные либо ежедневно, либо несколько раз в день,
            либо в реальном времени — в зависимости от типа сенсора и выбранных настроек.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-green-700 dark:text-green-400">Непрерывный мониторинг:</strong> Если устройство поддерживает
              непрерывный мониторинг (например, Dexcom, Libre или некоторые браслеты), BioMath Core может реагировать сразу,
              когда показатель выходит за нормальные пределы. Реакция не является медицинским диагнозом — это объяснение тренда
              и подсказка, как скорректировать поведение.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DataInfluenceReportsSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
          <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Влияние на отчеты
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            Когда пользователь создает новый отчет, подключенные устройства автоматически дают дополнительные контекстные данные.
            Это позволяет AI формировать выводы не только на основе анкет и слов пользователя, но и на основе реальных
            физиологических сигналов. Отчеты становятся точнее и персональнее.
          </p>
        </div>
      </div>
    </div>
  );
}

export function DataInfluenceAISection() {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Влияние на AI Assistant
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            В чате AI Assistant может опираться на текущие показатели. Если, например, HRV падает несколько дней подряд,
            AI подсказывает, что нервная система перегружена, и рекомендует восстановление. Если глюкоза нестабильна,
            AI объясняет почему и какие шаги помогут сгладить скачки.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-purple-700 dark:text-purple-400">Второе мнение:</strong> Если включено второе мнение,
              оба мнения рассматривают одни и те же данные, но объясняют их разными подходами: строгий физиологический анализ
              и адаптивное поведенческое объяснение.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AlertsNudgesSection() {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
          <Bell className="h-6 w-6 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Мягкие подсказки и нуджи
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3">
            Пользователь может включить мягкие нуджи — короткие подсказки, когда показатели идут в неблагоприятном направлении.
            Это не тревога и не диагноз. Это мягкое напоминание, что стоит сделать шаг в сторону стабилизации: отдохнуть,
            подышать, выпить воды, прогуляться или снизить нагрузку.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong className="text-orange-700 dark:text-orange-400">Позитивное подкрепление:</strong> Если показатели резко
              улучшаются — мы тоже сообщаем. Это укрепляет мотивацию и формирует позитивное подкрепление.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function UserSettingsSection() {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/40 dark:to-slate-900/40 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
          <Settings className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Настройки синхронизации
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Пользователь сам решает, какие данные использовать и в каком режиме:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Только ночью</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Для анализа сна</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Только утром</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Для анализа восстановления</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <Clock className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Каждые несколько часов</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Общая динамика</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Непрерывно</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Если сенсор поддерживает</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
            Настройки можно менять без повторного подключения устройства.
          </p>
        </div>
      </div>
    </div>
  );
}

export function WhyDevicesMatterSection() {
  return (
    <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-teal-200 dark:border-teal-800">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
          <TrendingUp className="h-6 w-6 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
            Почему устройства важны
          </h3>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Устройства убирают догадки. Здоровье становится не набором ощущений, а измеримым процессом.
            Это помогает замечать не симптомы, а ранние сигналы, пока всё ещё можно скорректировать без стресса и вмешательств.
          </p>
        </div>
      </div>
    </div>
  );
}

export function AdvancedBehaviorNote() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 border border-gray-300 dark:border-gray-700">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
            Продвинутая аналитика
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Некоторые устройства могут отдавать больше параметров, чем другие. Платформа не должна навязывать дополнительный
            интерфейс: если есть лишние данные, они обогащают аналитику, но не усложняют использование. Интерфейс остаётся
            одинаковым, независимо от глубины данных.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DeviceEducation() {
  return (
    <div className="space-y-6">
      <WhyDevicesMatterSection />
      <RealTimeBehaviorSection />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DataInfluenceReportsSection />
        <DataInfluenceAISection />
      </div>

      <AlertsNudgesSection />
      <UserSettingsSection />

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Примеры реальных сценариев
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Как платформа реагирует на изменения в данных устройств. Все реакции сформулированы в мягкой,
              неалармистской форме — как подсказки, а не диагнозы.
            </p>
          </div>
        </div>
        <DeviceScenarios />
      </div>

      <AdvancedBehaviorNote />
    </div>
  );
}
