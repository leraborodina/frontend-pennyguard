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
      imageUrl: 'https://i.ibb.co/hBvZMQj/ed41642d18e94f2799434df6b313949f-png-tplv-6bxrjdptv7-image-Photoroom-png-Photoroom.png',
      buttonLabel: 'подробнее',
      buttonAction: '/transaction-overview'
    },
    {
      title: 'Лимиты',
      description: 'Установите для себя финансовые рамки, обходите стороной ненужные траты.',
      imageUrl: 'https://i.ibb.co/chTMx59/99072452da914b05b6652d986fda951b-png-tplv-6bxrjdptv7-image-Photoroom-png-Photoroom.png',
      buttonLabel: 'подробнее',
      buttonAction: '/limit-form'
    },
    {
      title: 'Анализ',
      description: 'Используйте анализ транзакций. Визуальное представление поможет оптимизировать бюджет.',
      imageUrl: 'https://i.ibb.co/603F74z/Group-1000002301.png',
      buttonLabel: 'подробнее',
      buttonAction: '/transaction-chart'
    },
    {
      title: 'Цели',
      description: 'Поставьте перед собой финансовые цели. Регулярное накопление приведет вас к ним гораздо быстрее, чем вы думаете.',
      imageUrl: 'https://i.ibb.co/crLwqd7/2e347aabc7cb4f0387191700781e0f54-png-tplv-6bxrjdptv7-image-Photoroom-png-Photoroom.png',
      buttonLabel: 'подробнее',
      buttonAction: '/goal-form'
    }
  ];
  