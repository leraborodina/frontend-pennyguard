export interface CardData {
    title: string;
    description: string;
    imageUrl: string;
    buttonLabel: string;
    buttonAction: string;
  }
  
  export const cardData: CardData[] = [
    {
      title: 'Транзакции',
      description: 'Записывайте каждую операцию в свой личный журнал, чтобы лучше понимать свое финансовое положение.',
      imageUrl: '../../assets/img/transactions-basket.png',
      buttonLabel: 'подробнее',
      buttonAction: '/transaction-form'
    },
    {
      title: 'Лимиты',
      description: 'Установите для себя финансовые рамки, обходите стороной ненужные траты.',
      imageUrl: './../assets/img/limits-statistic.png',
      buttonLabel: 'подробнее',
      buttonAction: '/limit-form'
    },
    {
      title: 'Анализ',
      description: 'Используйте анализ транзакций. Визуальное представление поможет оптимизировать бюджет.',
      imageUrl: './../assets/img/analysis-diagram.png',
      buttonLabel: 'подробнее',
      buttonAction: '/transaction-analysis'
    },
    {
      title: 'Цели',
      description: 'Поставьте перед собой финансовые цели. Регулярное накопление приведет вас к ним гораздо быстрее, чем вы думаете.',
      imageUrl: './../assets/img/financial-goals.png',
      buttonLabel: 'подробнее',
      buttonAction: '/financial-goal-form'
    }
  ];
  