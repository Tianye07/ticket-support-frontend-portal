import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import Home from '../src/views/Home.vue';
import router from '../src/router';
import * as ticketApi from '../src/services/api/ticket/ticket.api';
import type { BackendTicket } from '../src/services/api/ticket';

vi.mock('../src/services/api/ticket/ticket.api');
vi.mock('../src/router', () => ({ default: { push: vi.fn() } }));

const tickets: BackendTicket.Ticket[] = [
  {
    id: '1',
    title: 'Unable to login',
    description: 'Invalid credentials after password reset',
    priority: 'high',
    status: 'in_progress',
    requesterName: 'Alice Tan',
    createdAt: '2026-09-24T10:00:00.000000Z',
    updatedAt: '2026-09-24T10:00:00.000000Z',
  },
];

describe('Home (ticket list)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows the tickets returned by the API', async () => {
    vi.mocked(ticketApi.getTicketListing).mockResolvedValue({ code: '0', success: true, data: tickets });

    const wrapper = mount(Home);
    await flushPromises();

    expect(wrapper.text()).toContain('Unable to login');
    expect(wrapper.text()).toContain('Alice Tan');
    expect(wrapper.text()).toContain('In Progress');
  });

  it('shows an empty state when there are no tickets', async () => {
    vi.mocked(ticketApi.getTicketListing).mockResolvedValue({ code: '0', success: true, data: [] });

    const wrapper = mount(Home);
    await flushPromises();

    expect(wrapper.text()).toContain('No tickets found');
  });

  it('shows an error with a retry button when loading fails', async () => {
    vi.mocked(ticketApi.getTicketListing).mockRejectedValueOnce(new Error('Network Error'));

    const wrapper = mount(Home);
    await flushPromises();

    const alert = wrapper.find('[role="alert"]');
    expect(alert.text()).toContain('Something went wrong');

    vi.mocked(ticketApi.getTicketListing).mockResolvedValue({ code: '0', success: true, data: tickets });
    await alert.find('button').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Unable to login');
  });

  it('sends the selected filters to the API', async () => {
    vi.mocked(ticketApi.getTicketListing).mockResolvedValue({ code: '0', success: true, data: [] });

    const wrapper = mount(Home);
    await flushPromises();

    const [prioritySelect, statusSelect] = wrapper.findAll('select');
    await prioritySelect!.setValue('high');
    await statusSelect!.setValue('open');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(ticketApi.getTicketListing).toHaveBeenLastCalledWith(
      expect.objectContaining({ priority: 'high', status: 'open' })
    );
  });

  it('opens the ticket details page when a ticket is clicked', async () => {
    vi.mocked(ticketApi.getTicketListing).mockResolvedValue({ code: '0', success: true, data: tickets });

    const wrapper = mount(Home);
    await flushPromises();
    await wrapper.find('li > div').trigger('click');

    expect(router.push).toHaveBeenCalledWith({ name: 'TicketDetails', params: { id: '1' } });
  });
});
