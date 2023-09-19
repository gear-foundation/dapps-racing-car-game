import styles from './stay-tuned.module.scss';

export function StayTuned() {
  return (
    <div className={styles.container}>
      <p>
        Thanks for participating in incentivized testnet, your help really
        matters!
      </p>
      <p>
        All the future announcements will be posted on the social media channels
        -{' '}
        <a
          href='https://twitter.com/VaraNetwork'
          target='_blank'
          rel='noreferrer'
        >
          Twitter
        </a>
        ,{' '}
        <a
          href='https://t.me/VaraNetwork_Global'
          target='_blank'
          rel='noreferrer'
        >
          Telegram
        </a>
        ,{' '}
        <a
          href='https://discord.com/invite/7BQznC9uD9'
          target='_blank'
          rel='noreferrer'
        >
          Discord
        </a>
        .
      </p>
    </div>
  );
}
