import React, { useState } from 'react';
import { Header } from '../../../components';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import type { Route } from './+types/trips';
import { comboBoxItems, selectItems } from '~/constants';
import { cn, formatKey } from '~/lib/utils';
import {
  LayerDirective,
  LayersDirective,
  MapsComponent,
} from '@syncfusion/ej2-react-maps';
import { world_map } from '~/constants/world_map';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '~/appwrite/client';
import { countries } from '~/constants/countries';
import { useNavigate } from 'react-router';

export const loader = async () => {
  return countries.map((country: any) => ({
    name: country.flag.emoji + ' ' + country.names.common,
    coordinates: country.coordinates
      ? [country.coordinates.lat, country.coordinates.lng]
      : [0, 0],
    value: country.names.common,
    openStreetMap: country.links?.open_street_maps || null,
  }));
};

const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
  const countries = loaderData as unknown as Country[];
  const [formData, setFormData] = useState<TripFormData>({
    country: countries[0]?.name || '',
    travelStyle: '',
    interest: '',
    budget: '',
    duration: 0,
    groupType: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (
      !formData.country ||
      !formData.travelStyle ||
      !formData.interest ||
      !formData.budget ||
      !formData.groupType
    ) {
      setError('Please provide values for all fields');
      setLoading(false);
      return;
    }

    if (formData.duration < 1 || formData.duration > 10) {
      setError('Duration must be between 1 and 10 days');
      setLoading(false);
      return;
    }

    const user = await account.get();
    if (!user.$id) {
      console.error('user not authenticated');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/create-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: formData.country,
          numberOfDays: formData.duration,
          travelStyle: formData.travelStyle,
          interests: formData.interest,
          budget: formData.budget,
          groupType: formData.groupType,
          userId: user.$id,
        }),
      });
      const result: CreateTripResponse = await response.json();
      if (result?.id) navigate(`/trips/${result.id}`);
      else console.error('Could not create trip');
    } catch (error: any) {
      if (error.status === 503) {
        console.warn(
          'AI service is currently unavailable. Please try again later.'
        );
        setError(
          'AI service is currently unavailable. Please try again later.'
        );
        return;
      } else {
        console.error('Error creating trip:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = async (
    key: keyof TripFormData,
    value: string | number
  ) => {
    setFormData({ ...formData, [key]: value });
  };

  const mapData = [
    {
      country: formData.country,
      color: '#EA382E',
      coordinates: countries.find((c: Country) => c.name === formData.country)
        ?.coordinates || [0, 0],
    },
  ];

  const countryData = countries.map((country) => ({
    text: country.name,
    value: country.value,
  }));

  return (
    <main className="flex flex-col gap-10 pb-20 wrapper">
      <Header
        title="Add a new Trip"
        description="View and edit AI generated travel plans"
      />
      <section className="mt-2.5 wrapper-md">
        <form className="trip-form" onClick={handleSubmit}>
          <div>
            <label htmlFor="country">Country</label>
            <ComboBoxComponent
              id="country"
              dataSource={countryData}
              fields={{ text: 'text', value: 'value' }}
              placeholder="Select a Country"
              className="combo-box"
              change={(e: { value: string | undefined }) => {
                if (e.value) {
                  handleChange('country', e.value);
                }
              }}
              allowFiltering
              filtering={(e) => {
                const query = e.text.toLowerCase();
                e.updateData(
                  countries
                    .filter((country) =>
                      country.name.toLowerCase().includes(query)
                    )
                    .map((country) => ({
                      text: country.name,
                      value: country.value,
                    }))
                );
              }}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration</label>
            <input
              id="duration"
              name="duration"
              placeholder="Enter a number of days"
              className="form-input placeholder:text-gray-100"
              onChange={(e) => handleChange('duration', Number(e.target.value))}
            />
          </div>
          {selectItems.map((key) => (
            <div key={key}>
              <label htmlFor={key}>{formatKey(key)}</label>
              <ComboBoxComponent
                id={key}
                dataSource={comboBoxItems[key].map((item) => ({
                  text: item,
                  value: item,
                }))}
                fields={{ text: 'text', value: 'value' }}
                placeholder={`Select a ${formatKey(key)}`}
                className="combo-box"
                change={(e: { value: string | undefined }) => {
                  if (e.value) {
                    handleChange(key as keyof TripFormData, e.value);
                  }
                }}
                allowFiltering
                filtering={(e) => {
                  const query = e.text.toLowerCase();
                  e.updateData(
                    comboBoxItems[key]
                      .filter((item) => item.toLowerCase().includes(query))
                      .map((item) => ({
                        text: item,
                        value: item,
                      }))
                  );
                }}
              />
            </div>
          ))}

          <div>
            <label htmlFor="location">Location on the world map</label>
            <MapsComponent>
              <LayersDirective>
                <LayerDirective
                  dataSource={mapData}
                  shapeData={world_map}
                  shapeDataPath="country"
                  shapePropertyPath="name"
                  shapeSettings={{ colorValuePath: 'color', fill: '#e5e5e5' }}
                />
              </LayersDirective>
            </MapsComponent>
          </div>

          <div className="bg-gray-200 h-px w-full" />

          {error && (
            <div className="error">
              <p>{error}</p>
            </div>
          )}
          <footer className="px-6 w-full">
            <ButtonComponent
              type="submit"
              className="button-class h-12! w-full!"
              disabled={loading}
            >
              <img
                src={`/assets/icons/${loading ? 'loader.svg' : 'magic-star.svg'}`}
                className={cn('size-5', { 'animate-spin': loading })}
                alt="magic star"
              />
              <span className="p-16-semibold text-white">
                {loading ? 'Generating...' : 'Generate Trip'}
              </span>
            </ButtonComponent>
          </footer>
        </form>
      </section>
    </main>
  );
};
export default CreateTrip;
