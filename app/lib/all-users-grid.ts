import { cn } from '~/lib/utils';

type GridUser = BaseUser & {
  status: 'user' | 'admin';
};

type GridCellInfoArgs = {
  data?: unknown;
  cell?: HTMLElement | null;
  column?: {
    field?: string;
  };
};

const DEFAULT_AVATAR = '/assets/images/david.webp';

export const handleAllUsersCellInfo = (args: GridCellInfoArgs) => {
  const user = args.data as GridUser | undefined;
  const field = args.column?.field;
  const cell = args.cell;

  if (!user || !field || !cell) return;

  if (field === 'name') {
    cell.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'flex items-center gap-1.5 px-4';

    const avatar = document.createElement('img');
    avatar.src = user.imageUrl || DEFAULT_AVATAR;
    avatar.alt = 'user';
    avatar.className = 'rounded-full size-8 aspect-square';
    avatar.referrerPolicy = 'no-referrer';

    const name = document.createElement('span');
    name.textContent = user.name;

    wrapper.append(avatar, name);
    cell.appendChild(wrapper);
  }

  if (field === 'status') {
    const status = user.status;

    cell.innerHTML = '';

    const badge = document.createElement('article');
    badge.className = cn(
      'status-column',
      status === 'user' ? 'bg-success-50' : 'bg-light-300'
    );

    const dot = document.createElement('div');
    dot.className = cn(
      'size-1.5 rounded-full',
      status === 'user' ? 'bg-success-500' : 'bg-gray-500'
    );

    const text = document.createElement('h3');
    text.className = cn(
      'font-inter text-xs font-medium',
      status === 'user' ? 'text-success-700' : 'text-gray-500'
    );
    text.textContent = status;

    badge.append(dot, text);
    cell.appendChild(badge);
  }
};
