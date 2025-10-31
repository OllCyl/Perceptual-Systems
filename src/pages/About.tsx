import { useLanguage } from '../context/LanguageContext'

const About = () => {
  const { t } = useLanguage()

  return (
    <div className="py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('about.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('about.intro')}
          </p>
        </div>

        <div className="space-y-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary-600">
              {t('about.bio.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('about.bio.content')}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary-600">
              {t('about.experience.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('about.experience.content')}
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary-600">
              {t('about.approach.title')}
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {t('about.approach.content')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
