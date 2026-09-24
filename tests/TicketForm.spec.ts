import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import TicketForm from '../src/views/ticket/components/TicketForm.vue';
import * as ticketApi from '../src/services/api/ticket/ticket.api';
import type { BackendTicket } from '../src/services/api/ticket';

vi.mock('../src/services/api/ticket/ticket.api');

const ticket: BackendTicket.Ticket = {
  id: '5',
  title: 'Printer is broken',
  description: 'Paper jam on floor 3',
  priority: 'high',
  status: 'open',
  requesterName: 'Alice Tan',
  createdAt: '2026-09-24T10:00:00.000000Z',
  updatedAt: '2026-09-24T10:00:00.000000Z',
};

// Finds the input/select/textarea linked to a <label> by its text
function field(wrapper: VueWrapper, label: string) {
  const labelEl = wrapper.findAll('label').find((el) => el.text().startsWith(label));
  return wrapper.find(`[id="${labelEl?.attributes('for')}"]`);
}

describe('TicketForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('create mode', () => {
    it('submits the form and emits creation:succeed', async () => {
      vi.mocked(ticketApi.postCreateTicket).mockResolvedValue({ code: '0', success: true, data: ticket });

      const wrapper = mount(TicketForm);
      await field(wrapper, 'Title').setValue('Printer is broken');
      await field(wrapper, 'Requester name').setValue('Alice Tan');
      await field(wrapper, 'Priority').setValue('high');
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      expect(ticketApi.postCreateTicket).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Printer is broken',
          requesterName: 'Alice Tan',
          priority: 'high',
          status: 'open',
        })
      );
      expect(wrapper.emitted('creation:succeed')).toHaveLength(1);
    });

    it('shows server validation errors under the matching fields', async () => {
      vi.mocked(ticketApi.postCreateTicket).mockRejectedValue({
        response: {
          status: 422,
          data: {
            message: 'The title field is required. (and 1 more error)',
            errors: {
              title: ['The title field is required.'],
              requesterName: ['The requester name field is required.'],
            },
          },
        },
      });

      const wrapper = mount(TicketForm);
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      expect(wrapper.text()).toContain('The title field is required.');
      expect(wrapper.text()).toContain('The requester name field is required.');
      expect(wrapper.emitted('creation:succeed')).toBeUndefined();
    });

    it('shows a general error message when the request fails', async () => {
      vi.mocked(ticketApi.postCreateTicket).mockRejectedValue(new Error('Network Error'));

      const wrapper = mount(TicketForm);
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      expect(wrapper.find('[role="alert"]').text()).toContain('Something went wrong');
    });
  });

  describe('edit mode', () => {
    it('loads the ticket and pre-fills the form', async () => {
      vi.mocked(ticketApi.getTicketDetails).mockResolvedValue({ code: '0', success: true, data: ticket });

      const wrapper = mount(TicketForm, { props: { id: '5' } });
      await flushPromises();

      expect(ticketApi.getTicketDetails).toHaveBeenCalledWith('5');
      expect(wrapper.text()).toContain('Ticket details');
      expect((field(wrapper, 'Title').element as HTMLInputElement).value).toBe('Printer is broken');
      expect((field(wrapper, 'Status').element as HTMLSelectElement).value).toBe('open');
    });

    it('updates the status and emits update:succeed', async () => {
      vi.mocked(ticketApi.getTicketDetails).mockResolvedValue({ code: '0', success: true, data: ticket });
      vi.mocked(ticketApi.putUpdateTicket).mockResolvedValue({
        code: '0',
        success: true,
        data: { ...ticket, status: 'resolved' },
      });

      const wrapper = mount(TicketForm, { props: { id: '5' } });
      await flushPromises();
      await field(wrapper, 'Status').setValue('resolved');
      await wrapper.find('form').trigger('submit');
      await flushPromises();

      expect(ticketApi.putUpdateTicket).toHaveBeenCalledWith('5', expect.objectContaining({ status: 'resolved' }));
      expect(wrapper.emitted('update:succeed')).toHaveLength(1);
    });

    it('shows an error when the ticket does not exist', async () => {
      vi.mocked(ticketApi.getTicketDetails).mockRejectedValue({
        response: { status: 404, data: { code: '0001', success: false, message: 'Ticket not found.' } },
      });

      const wrapper = mount(TicketForm, { props: { id: '999' } });
      await flushPromises();

      expect(wrapper.find('[role="alert"]').text()).toBe('Ticket not found.');
      expect(wrapper.find('form').exists()).toBe(false);
    });
  });
});
